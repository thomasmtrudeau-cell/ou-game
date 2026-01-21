/**
 * Content Sync Script
 *
 * This script fetches CSV data from a Google Sheet and syncs it to Supabase.
 *
 * HOW TO USE:
 *   node scripts/sync.js           - Add new topics only
 *   node scripts/sync.js --delete  - Also remove topics not in the sheet
 *
 * EXPECTED CSV FORMAT:
 * id,text,emoji,category
 * 1,Pineapple on Pizza,🍕,Food
 * 2,Remote Work,💻,Work
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const csvUrl = process.env.GOOGLE_SHEET_CSV_URL

// Check for --delete flag
const shouldDelete = process.argv.includes('--delete')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

if (!csvUrl) {
  console.error('❌ Missing GOOGLE_SHEET_CSV_URL in .env.local')
  console.log('\nTo get your CSV URL:')
  console.log('1. Open your Google Sheet')
  console.log('2. Go to File > Share > Publish to web')
  console.log('3. Select your sheet tab')
  console.log('4. Choose "Comma-separated values (.csv)" format')
  console.log('5. Click Publish and copy the URL')
  console.log('6. Add it to .env.local as: GOOGLE_SHEET_CSV_URL=your_url_here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Parse CSV text into array of objects
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index].trim()
      })
      rows.push(row)
    }
  }
  return rows
}

// Handle CSV values that might contain commas within quotes
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

async function syncContent() {
  console.log('🔄 Fetching CSV from Google Sheets...')
  if (shouldDelete) {
    console.log('⚠️  Delete mode enabled: topics not in sheet will be removed\n')
  }

  try {
    // Fetch the CSV
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    const rows = parseCSV(csvText)

    console.log(`📊 Found ${rows.length} rows in the spreadsheet`)

    if (rows.length === 0) {
      console.log('⚠️  No data rows found in CSV')
      return
    }

    // Validate required columns
    const requiredColumns = ['id', 'text', 'emoji', 'category']
    const firstRow = rows[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))

    if (missingColumns.length > 0) {
      console.error(`❌ Missing required columns: ${missingColumns.join(', ')}`)
      console.log('\nYour CSV should have these columns:')
      console.log('id, text, emoji, category')
      return
    }

    // Get existing topics from Supabase
    const { data: existingTopics, error: fetchError } = await supabase
      .from('topics')
      .select('id, text')

    if (fetchError) {
      throw fetchError
    }

    const existingIds = new Set(existingTopics?.map(t => t.id) || [])
    const sheetIds = new Set(rows.map(r => r.id))

    // Find new rows to add
    const newRows = rows.filter(row => !existingIds.has(row.id))

    // Find rows to delete (in database but not in sheet)
    const idsToDelete = [...existingIds].filter(id => !sheetIds.has(id))

    // Summary
    console.log(`\n📈 Sync Summary:`)
    console.log(`   • ${existingIds.size} topics currently in database`)
    console.log(`   • ${rows.length} topics in spreadsheet`)
    console.log(`   • ${newRows.length} new topics to add`)
    if (shouldDelete) {
      console.log(`   • ${idsToDelete.length} topics to remove`)
    }
    console.log('')

    // Upsert all rows (update existing, insert new)
    if (rows.length > 0) {
      console.log(`📝 Syncing ${rows.length} topics...`)

      const topicsToUpsert = rows.map(row => ({
        id: row.id,
        text: row.text,
        emoji: row.emoji,
        category: row.category
      }))

      // Upsert in batches of 500 to avoid timeouts
      const batchSize = 500
      for (let i = 0; i < topicsToUpsert.length; i += batchSize) {
        const batch = topicsToUpsert.slice(i, i + batchSize)
        const { error: upsertError } = await supabase
          .from('topics')
          .upsert(batch, { onConflict: 'id', ignoreDuplicates: false })

        if (upsertError) {
          throw upsertError
        }
        console.log(`   ✓ Synced batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(topicsToUpsert.length/batchSize)}`)
      }

      console.log(`✅ Synced ${rows.length} topics (${newRows.length} new)`)

      // Show first 5 new topics if any
      if (newRows.length > 0) {
        const preview = newRows.slice(0, 5)
        console.log(`   New topics:`)
        preview.forEach(row => {
          console.log(`   ${row.emoji} ${row.text}`)
        })
        if (newRows.length > 5) {
          console.log(`   ... and ${newRows.length - 5} more`)
        }
      }
    }

    // Delete removed rows
    if (shouldDelete && idsToDelete.length > 0) {
      console.log(`\n🗑️  Removing ${idsToDelete.length} topics not in spreadsheet...`)

      // Get the topics being deleted for logging
      const topicsBeingDeleted = existingTopics.filter(t => idsToDelete.includes(t.id))

      const { error: deleteError } = await supabase
        .from('topics')
        .delete()
        .in('id', idsToDelete)

      if (deleteError) {
        throw deleteError
      }

      console.log(`✅ Removed ${idsToDelete.length} topics`)

      // Show first 10 deleted topics
      const preview = topicsBeingDeleted.slice(0, 10)
      preview.forEach(topic => {
        console.log(`   ❌ ${topic.text}`)
      })
      if (topicsBeingDeleted.length > 10) {
        console.log(`   ... and ${topicsBeingDeleted.length - 10} more`)
      }
    } else if (!shouldDelete && idsToDelete.length > 0) {
      console.log(`\n💡 Tip: ${idsToDelete.length} topics in database are not in your spreadsheet.`)
      console.log(`   Run with --delete flag to remove them:`)
      console.log(`   node scripts/sync.js --delete`)
    }

    console.log('\n🎉 Sync complete!')

  } catch (error) {
    console.error('❌ Error syncing content:', error.message)
    process.exit(1)
  }
}

syncContent()
