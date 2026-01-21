/**
 * Fetch NFL player data from Sleeper API and merge with our dynasty values
 *
 * Usage: node scripts/fetch-sleeper-players.js
 *
 * Sleeper provides: name, team, position, age, years_exp
 * We add: baseValue (estimated from heuristics or preserved from existing data)
 */

const fs = require('fs');
const path = require('path');

const SLEEPER_API = 'https://api.sleeper.app/v1/players/nfl';
const OUTPUT_PATH = path.join(__dirname, '../data/players.json');

// Positions we care about for dynasty
const DYNASTY_POSITIONS = ['QB', 'RB', 'WR', 'TE'];

// Base value estimates by position and age tier
// These are rough heuristics - real values would come from KeepTradeCut/FantasyCalc
const VALUE_TIERS = {
  QB: {
    elite: 95,      // Top 5 starters
    starter: 60,    // QB1s
    young: 45,      // Young with upside
    backup: 15,     // Backups
  },
  RB: {
    elite: 85,
    starter: 50,
    young: 40,
    backup: 15,
  },
  WR: {
    elite: 90,
    starter: 55,
    young: 45,
    backup: 15,
  },
  TE: {
    elite: 75,
    starter: 40,
    young: 30,
    backup: 10,
  },
};

// Known elite/valuable players - preserve higher values
const ELITE_PLAYERS = new Set([
  'Patrick Mahomes', 'Josh Allen', 'Joe Burrow', 'Lamar Jackson', 'Justin Herbert',
  'C.J. Stroud', 'Jayden Daniels', 'Jalen Hurts', 'Jordan Love',
  "Ja'Marr Chase", 'Justin Jefferson', 'CeeDee Lamb', 'Tyreek Hill', 'A.J. Brown',
  'Malik Nabers', 'Marvin Harrison Jr', 'Garrett Wilson', 'Amon-Ra St. Brown',
  'Puka Nacua', 'Nico Collins', 'Drake London',
  'Breece Hall', 'Bijan Robinson', 'Jahmyr Gibbs', 'Jonathan Taylor',
  "De'Von Achane", 'Kenneth Walker III', 'Isiah Pacheco', 'James Cook',
  'Brock Bowers', 'Sam LaPorta', 'Trey McBride', 'Dalton Kincaid', 'Kyle Pitts',
]);

// Load existing players to preserve our custom values
function loadExistingPlayers() {
  try {
    const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    const byName = {};
    for (const player of data.players) {
      byName[player.name.toLowerCase()] = player;
    }
    return byName;
  } catch (e) {
    console.log('No existing players.json found, starting fresh');
    return {};
  }
}

// Estimate dynasty value based on position, age, and years of experience
function estimateValue(player, position) {
  const age = player.age || 25;
  const yearsExp = player.years_exp || 0;
  const isElite = ELITE_PLAYERS.has(player.full_name);

  const tiers = VALUE_TIERS[position];
  if (!tiers) return 20;

  // Elite known players
  if (isElite) {
    return tiers.elite;
  }

  // Estimate based on age and experience
  if (position === 'QB') {
    if (age <= 25 && yearsExp <= 2) return tiers.young + Math.floor(Math.random() * 15);
    if (age <= 30) return tiers.starter + Math.floor(Math.random() * 20);
    if (age <= 35) return tiers.starter - 10 + Math.floor(Math.random() * 15);
    return tiers.backup + Math.floor(Math.random() * 10);
  }

  if (position === 'RB') {
    // RBs depreciate fast
    if (age <= 24 && yearsExp <= 2) return tiers.young + Math.floor(Math.random() * 20);
    if (age <= 26) return tiers.starter + Math.floor(Math.random() * 15);
    if (age <= 28) return tiers.starter - 15 + Math.floor(Math.random() * 15);
    return tiers.backup + Math.floor(Math.random() * 10);
  }

  if (position === 'WR') {
    if (age <= 24 && yearsExp <= 2) return tiers.young + Math.floor(Math.random() * 20);
    if (age <= 28) return tiers.starter + Math.floor(Math.random() * 20);
    if (age <= 30) return tiers.starter - 10 + Math.floor(Math.random() * 15);
    return tiers.backup + Math.floor(Math.random() * 15);
  }

  if (position === 'TE') {
    if (age <= 25 && yearsExp <= 2) return tiers.young + Math.floor(Math.random() * 15);
    if (age <= 29) return tiers.starter + Math.floor(Math.random() * 15);
    return tiers.backup + Math.floor(Math.random() * 10);
  }

  return 20;
}

// Estimate years to peak based on age and position
function estimateYearsToPeak(age, position) {
  const peakAges = { QB: 28, RB: 25, WR: 27, TE: 27 };
  const peak = peakAges[position] || 27;
  return Math.max(0, peak - (age || 25));
}

// Estimate reception profile based on position
function estimateReceptionProfile(position, name) {
  // Some known profiles
  const highVolume = ['Breece Hall', 'Bijan Robinson', 'Jahmyr Gibbs', "De'Von Achane",
    'Christian McCaffrey', 'Austin Ekeler', 'Alvin Kamara'];
  const lowVolume = ['Derrick Henry', 'Kenneth Walker III', 'Isiah Pacheco'];

  if (highVolume.includes(name)) return 'high';
  if (lowVolume.includes(name)) return 'low';

  if (position === 'WR' || position === 'TE') return 'high';
  if (position === 'RB') return 'medium';
  return 'medium';
}

async function fetchSleeperPlayers() {
  console.log('Fetching players from Sleeper API...');

  const response = await fetch(SLEEPER_API);
  if (!response.ok) {
    throw new Error(`Sleeper API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Received ${Object.keys(data).length} total players from Sleeper`);

  return data;
}

function transformPlayers(sleeperData, existingPlayers) {
  const players = [];
  const seen = new Set();

  for (const [playerId, player] of Object.entries(sleeperData)) {
    // Skip if not a dynasty-relevant position
    const position = player.position;
    if (!DYNASTY_POSITIONS.includes(position)) continue;

    // Skip if no team (free agents) unless they're notable
    if (!player.team && !ELITE_PLAYERS.has(player.full_name)) continue;

    // Skip inactive players
    if (player.status === 'Inactive') continue;

    // Skip duplicates
    const nameKey = player.full_name?.toLowerCase();
    if (!nameKey || seen.has(nameKey)) continue;
    seen.add(nameKey);

    // Check if we have existing data for this player
    const existing = existingPlayers[nameKey];

    // Build player object
    const newPlayer = {
      id: `${position.toLowerCase()}-${playerId}`,
      name: player.full_name,
      team: player.team || 'FA',
      position: position,
      age: player.age || null,
      baseValue: existing?.baseValue || estimateValue(player, position),
      receptionProfile: existing?.receptionProfile || estimateReceptionProfile(position, player.full_name),
      yearsToPeak: existing?.yearsToPeak ?? estimateYearsToPeak(player.age, position),
    };

    // Preserve history if we have it
    if (existing?.history) {
      newPlayer.history = existing.history;
    }

    players.push(newPlayer);
  }

  // Sort by value descending
  players.sort((a, b) => b.baseValue - a.baseValue);

  return players;
}

async function main() {
  try {
    const existingPlayers = loadExistingPlayers();
    console.log(`Loaded ${Object.keys(existingPlayers).length} existing players`);

    const sleeperData = await fetchSleeperPlayers();
    const players = transformPlayers(sleeperData, existingPlayers);

    // Stats
    const byPosition = players.reduce((acc, p) => {
      acc[p.position] = (acc[p.position] || 0) + 1;
      return acc;
    }, {});

    console.log(`\nTransformed ${players.length} dynasty-relevant players:`);
    Object.entries(byPosition).sort((a, b) => b[1] - a[1]).forEach(([pos, count]) => {
      console.log(`  ${pos}: ${count}`);
    });

    // Write output
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ players }, null, 2));
    console.log(`\nSaved to ${OUTPUT_PATH}`);

    // Show top 10 by value
    console.log('\nTop 10 players by value:');
    players.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.position}, ${p.team}) - ${p.baseValue}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
