// =============================================================================
// SV ONBOARDING PROTOTYPE - Mock Data (Spreadsheet Model)
// =============================================================================
// This file mimics Google Sheets structure with flat arrays of objects.
// Each "sheet" is an array that could map directly to a spreadsheet tab.
// =============================================================================

// -----------------------------------------------------------------------------
// PLAYERS SHEET - Core player roster
// -----------------------------------------------------------------------------
export const players_sheet = [
  {
    id: "player_01",
    name: "Braedon Mackay",
    email: "braedon.mackay@email.com",
    phone: "941-555-0101",
    level: "High School", // High School | College | MiLB | MLB
    position: "INF",
    height: "6'4\"",
    weight: 203,
    ideal_weight: 220,
    sixty_time: "",
    exit_velo: "",
    arm_velo: "",
    training_budget: "$$", // $ | $$ | $$$
    high_school: "Sarasota High",
    travel_team: "Florida Burn",
    facility: "OTA",
    agent_id: "agent_01",
    onboarding_date: "2026-01-05",
    onboarding_status: "in_progress", // not_started | in_progress | complete
    profile_image: "",
  },
  {
    id: "player_02",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "813-555-0202",
    level: "College",
    position: "RHP",
    height: "6'2\"",
    weight: 195,
    ideal_weight: 205,
    sixty_time: "6.8",
    exit_velo: "94",
    arm_velo: "92",
    training_budget: "$$$",
    high_school: "Tampa Jesuit",
    travel_team: "",
    facility: "Driveline",
    agent_id: "agent_01",
    onboarding_date: "2025-11-15",
    onboarding_status: "complete",
    profile_image: "",
  },
  {
    id: "player_03",
    name: "Jordan Williams",
    email: "jordan.w@email.com",
    phone: "727-555-0303",
    level: "MiLB",
    position: "OF",
    height: "6'0\"",
    weight: 185,
    ideal_weight: 190,
    sixty_time: "6.5",
    exit_velo: "102",
    arm_velo: "88",
    training_budget: "$$$",
    high_school: "Clearwater Central Catholic",
    travel_team: "",
    facility: "",
    agent_id: "agent_02",
    onboarding_date: "2025-08-20",
    onboarding_status: "complete",
    profile_image: "",
  },
];

// -----------------------------------------------------------------------------
// AGENTS SHEET - SV Staff contacts
// -----------------------------------------------------------------------------
export const agents_sheet = [
  {
    id: "agent_01",
    name: "Mike Thompson",
    email: "mike@stadium-ventures.com",
    phone: "813-555-1000",
    role: "Lead Agent",
  },
  {
    id: "agent_02",
    name: "Sarah Martinez",
    email: "sarah@stadium-ventures.com",
    phone: "813-555-1001",
    role: "Agent",
  },
  {
    id: "agent_03",
    name: "Chris Bernard",
    email: "chris@stadium-ventures.com",
    phone: "813-555-1002",
    role: "Performance Director",
  },
];

// -----------------------------------------------------------------------------
// GOALS SHEET - Player goals and SV goals
// -----------------------------------------------------------------------------
export const goals_sheet = [
  { id: "goal_01", player_id: "player_01", type: "player", priority: 1, goal: "Improve Footwork" },
  { id: "goal_02", player_id: "player_01", type: "player", priority: 2, goal: "Continue to Build Frame" },
  { id: "goal_03", player_id: "player_01", type: "player", priority: 3, goal: "Tap into Power" },
  { id: "goal_04", player_id: "player_01", type: "sv", priority: 1, goal: "Improve Footwork" },
  { id: "goal_05", player_id: "player_01", type: "sv", priority: 2, goal: "Continue to Build Frame" },
  { id: "goal_06", player_id: "player_01", type: "sv", priority: 3, goal: "Tap into Power" },
  { id: "goal_07", player_id: "player_02", type: "player", priority: 1, goal: "Add velocity" },
  { id: "goal_08", player_id: "player_02", type: "player", priority: 2, goal: "Develop changeup" },
  { id: "goal_09", player_id: "player_02", type: "sv", priority: 1, goal: "Velocity program" },
  { id: "goal_10", player_id: "player_02", type: "sv", priority: 2, goal: "Pitch design work" },
];

// -----------------------------------------------------------------------------
// SCHEDULE SHEET - Weekly training schedule
// -----------------------------------------------------------------------------
export const schedule_sheet = [
  { id: "sched_01", player_id: "player_01", day: "Sun", lift: true, practice: true, training: true },
  { id: "sched_02", player_id: "player_01", day: "Mon", lift: true, practice: true, training: true },
  { id: "sched_03", player_id: "player_01", day: "Tue", lift: true, practice: true, training: true },
  { id: "sched_04", player_id: "player_01", day: "Wed", lift: true, practice: true, training: true },
  { id: "sched_05", player_id: "player_01", day: "Thu", lift: true, practice: true, training: true },
  { id: "sched_06", player_id: "player_01", day: "Fri", lift: true, practice: true, training: true },
  { id: "sched_07", player_id: "player_01", day: "Sat", lift: true, practice: true, training: true },
];

// -----------------------------------------------------------------------------
// COLLEGE PREFERENCES SHEET - Target schools for HS/College players
// -----------------------------------------------------------------------------
export const college_preferences_sheet = [
  { id: "col_01", player_id: "player_01", rank: 1, school: "FSU", contacted: false },
  { id: "col_02", player_id: "player_01", rank: 2, school: "UCF", contacted: true },
  { id: "col_03", player_id: "player_01", rank: 3, school: "Wake Forest", contacted: true },
  { id: "col_04", player_id: "player_01", rank: 4, school: "Texas", contacted: false },
  { id: "col_05", player_id: "player_01", rank: 5, school: "Florida", contacted: true },
  { id: "col_06", player_id: "player_01", rank: 6, school: "UVA", contacted: true },
  { id: "col_07", player_id: "player_01", rank: 7, school: "UNC", contacted: false },
  { id: "col_08", player_id: "player_01", rank: 8, school: "USF", contacted: false },
  { id: "col_09", player_id: "player_01", rank: 9, school: "Alabama", contacted: false },
  { id: "col_10", player_id: "player_01", rank: 10, school: "Georgia Tech", contacted: false },
];

// -----------------------------------------------------------------------------
// FOUR PILLARS SHEET - Onboarding checklist items (Physical, Mental, Technique, Nutrition)
// -----------------------------------------------------------------------------
export const four_pillars_sheet = [
  // PHYSICAL - Player 01
  { id: "fp_01", player_id: "player_01", pillar: "Physical", item: "Weight lifting program", need: true, complete: true, notes: "Sent to us - OTA" },
  { id: "fp_02", player_id: "player_01", pillar: "Physical", item: "Out-of-school facility", need: true, complete: true, notes: "OTA" },
  { id: "fp_03", player_id: "player_01", pillar: "Physical", item: "Teambuildr workouts", need: false, complete: false, notes: "Going to OTA to do workouts w Chris B" },
  { id: "fp_04", player_id: "player_01", pillar: "Physical", item: "Dexa Scan", need: false, complete: false, notes: "" },
  { id: "fp_05", player_id: "player_01", pillar: "Physical", item: "VELO bat-speed training", need: false, complete: false, notes: "" },
  { id: "fp_06", player_id: "player_01", pillar: "Physical", item: "Prior data collection", need: false, complete: false, notes: "Force Plate, Trackman, S2 Cogn, Biomech, Blast" },

  // MENTAL - Player 01
  { id: "fp_07", player_id: "player_01", pillar: "Mental", item: "Personality testing sent", need: false, complete: false, notes: "" },
  { id: "fp_08", player_id: "player_01", pillar: "Mental", item: "Mental skills coach", need: false, complete: false, notes: "" },

  // TECHNIQUE - Player 01
  { id: "fp_09", player_id: "player_01", pillar: "Technique", item: "Private coach", need: false, complete: false, notes: "" },
  { id: "fp_10", player_id: "player_01", pillar: "Technique", item: "Customized drills", need: false, complete: false, notes: "" },
  { id: "fp_11", player_id: "player_01", pillar: "Technique", item: "Mechanical fixes", need: false, complete: true, notes: "" },
  { id: "fp_12", player_id: "player_01", pillar: "Technique", item: "Pitch grip changes", need: false, complete: false, notes: "N/A - Position player" },

  // NUTRITION - Player 01
  { id: "fp_13", player_id: "player_01", pillar: "Nutrition", item: "Nutrition plan offered", need: false, complete: false, notes: "" },
  { id: "fp_14", player_id: "player_01", pillar: "Nutrition", item: "Supplements review", need: false, complete: false, notes: "" },
  { id: "fp_15", player_id: "player_01", pillar: "Nutrition", item: "Sleep assessment", need: false, complete: true, notes: "Good" },
  { id: "fp_16", player_id: "player_01", pillar: "Nutrition", item: "Gut health testing", need: false, complete: false, notes: "Is going to do gut test" },
  { id: "fp_17", player_id: "player_01", pillar: "Nutrition", item: "Sweat testing", need: true, complete: false, notes: "" },
  { id: "fp_18", player_id: "player_01", pillar: "Nutrition", item: "Recovery assessment", need: false, complete: true, notes: "" },
  { id: "fp_19", player_id: "player_01", pillar: "Nutrition", item: "Snap Kitchen offered", need: false, complete: false, notes: "" },
  { id: "fp_20", player_id: "player_01", pillar: "Nutrition", item: "Weight goals set", need: true, complete: true, notes: "Gain - target 220 lbs" },
];

// -----------------------------------------------------------------------------
// TASKS SHEET - Onboarding & ongoing to-dos
// -----------------------------------------------------------------------------
export const tasks_sheet = [
  { id: "task_01", player_id: "player_01", task_name: "Complete player profile", category: "Onboarding", due_date: "2026-01-10", status: "complete" },
  { id: "task_02", player_id: "player_01", task_name: "Sign representation agreement", category: "Documents", due_date: "2026-01-12", status: "complete" },
  { id: "task_03", player_id: "player_01", task_name: "Schedule intro call with agent", category: "Onboarding", due_date: "2026-01-15", status: "complete" },
  { id: "task_04", player_id: "player_01", task_name: "Complete Four Pillars assessment", category: "Onboarding", due_date: "2026-01-20", status: "in_progress" },
  { id: "task_05", player_id: "player_01", task_name: "Upload medical records", category: "Documents", due_date: "2026-01-22", status: "pending" },
  { id: "task_06", player_id: "player_01", task_name: "Schedule Dexa scan", category: "Physical", due_date: "2026-01-25", status: "pending" },
  { id: "task_07", player_id: "player_01", task_name: "Review college target list with agent", category: "Recruiting", due_date: "2026-01-28", status: "pending" },
  { id: "task_08", player_id: "player_01", task_name: "Complete gut health test", category: "Nutrition", due_date: "2026-02-01", status: "pending" },
  { id: "task_09", player_id: "player_02", task_name: "Review pitch design report", category: "Technique", due_date: "2026-01-18", status: "pending" },
  { id: "task_10", player_id: "player_02", task_name: "Schedule velocity assessment", category: "Physical", due_date: "2026-01-20", status: "complete" },
];

// -----------------------------------------------------------------------------
// FILES SHEET - The Vault (documents)
// -----------------------------------------------------------------------------
export const files_sheet = [
  { id: "file_01", player_id: "player_01", file_name: "Representation Agreement", category: "Contracts", upload_date: "2026-01-05", link: "#" },
  { id: "file_02", player_id: "player_01", file_name: "Onboarding Documentation", category: "Onboarding", upload_date: "2026-01-05", link: "#" },
  { id: "file_03", player_id: "player_01", file_name: "Week 12 Hitting Report", category: "Performance", upload_date: "2026-01-10", link: "#" },
  { id: "file_04", player_id: "player_01", file_name: "College Target List 2026", category: "Recruiting", upload_date: "2026-01-08", link: "#" },
  { id: "file_05", player_id: "player_01", file_name: "Training Program - Q1 2026", category: "Training", upload_date: "2026-01-06", link: "#" },
  { id: "file_06", player_id: "player_01", file_name: "Medical Clearance Form", category: "Medical", upload_date: "2026-01-05", link: "#" },
  { id: "file_07", player_id: "player_02", file_name: "Pitch Design Analysis", category: "Performance", upload_date: "2025-12-15", link: "#" },
  { id: "file_08", player_id: "player_02", file_name: "Contract Incentives 2025", category: "Contracts", upload_date: "2025-11-20", link: "#" },
  { id: "file_09", player_id: "player_03", file_name: "MiLB Contract Summary", category: "Contracts", upload_date: "2025-08-25", link: "#" },
  { id: "file_10", player_id: "player_03", file_name: "Swing Metrics Report", category: "Performance", upload_date: "2025-12-01", link: "#" },
];

// -----------------------------------------------------------------------------
// GEAR REQUESTS SHEET - My Locker
// -----------------------------------------------------------------------------
export const gear_requests_sheet = [
  { id: "gear_01", player_id: "player_01", item_name: "SV Training Pullover", size: "L", quantity: 2, status: "shipped", request_date: "2026-01-06" },
  { id: "gear_02", player_id: "player_01", item_name: "SV Cap", size: "7 1/4", quantity: 1, status: "delivered", request_date: "2026-01-06" },
  { id: "gear_03", player_id: "player_02", item_name: "SV Dri-Fit Polo", size: "M", quantity: 3, status: "pending", request_date: "2026-01-15" },
  { id: "gear_04", player_id: "player_03", item_name: "SV Backpack", size: "One Size", quantity: 1, status: "delivered", request_date: "2025-09-01" },
];

// -----------------------------------------------------------------------------
// NOTES SHEET - Additional notes per player
// -----------------------------------------------------------------------------
export const notes_sheet = [
  { id: "note_01", player_id: "player_01", date: "2026-01-05", author: "Mike Thompson", note: "Wants gut test and blood test." },
  { id: "note_02", player_id: "player_01", date: "2026-01-05", author: "Mike Thompson", note: "Dad liked USF due to proximity." },
  { id: "note_03", player_id: "player_01", date: "2026-01-07", author: "Mike Thompson", note: "Wake has meeting with him this week." },
  { id: "note_04", player_id: "player_01", date: "2026-01-10", author: "Chris Bernard", note: "Meeting with Chris Bernard a couple of times a week at OTA." },
];

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

// Get player by ID
export function getPlayerById(playerId: string) {
  return players_sheet.find(p => p.id === playerId);
}

// Get agent by ID
export function getAgentById(agentId: string) {
  return agents_sheet.find(a => a.id === agentId);
}

// Get player's agent
export function getPlayerAgent(playerId: string) {
  const player = getPlayerById(playerId);
  if (!player) return null;
  return getAgentById(player.agent_id);
}

// Get goals for a player
export function getPlayerGoals(playerId: string) {
  return goals_sheet.filter(g => g.player_id === playerId);
}

// Get tasks for a player
export function getPlayerTasks(playerId: string) {
  return tasks_sheet.filter(t => t.player_id === playerId);
}

// Get files for a player
export function getPlayerFiles(playerId: string) {
  return files_sheet.filter(f => f.player_id === playerId);
}

// Get gear requests for a player
export function getPlayerGearRequests(playerId: string) {
  return gear_requests_sheet.filter(g => g.player_id === playerId);
}

// Get Four Pillars data for a player
export function getPlayerFourPillars(playerId: string) {
  return four_pillars_sheet.filter(fp => fp.player_id === playerId);
}

// Get college preferences for a player
export function getPlayerCollegePrefs(playerId: string) {
  return college_preferences_sheet.filter(c => c.player_id === playerId);
}

// Get notes for a player
export function getPlayerNotes(playerId: string) {
  return notes_sheet.filter(n => n.player_id === playerId);
}

// Calculate Four Pillars progress
export function getFourPillarsProgress(playerId: string) {
  const items = getPlayerFourPillars(playerId);
  const pillars = ["Physical", "Mental", "Technique", "Nutrition"];

  return pillars.map(pillar => {
    const pillarItems = items.filter(i => i.pillar === pillar);
    const completed = pillarItems.filter(i => i.complete).length;
    const total = pillarItems.length;
    return {
      pillar,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
}

// Get onboarding progress
export function getOnboardingProgress(playerId: string) {
  const tasks = getPlayerTasks(playerId).filter(t => t.category === "Onboarding");
  const completed = tasks.filter(t => t.status === "complete").length;
  const total = tasks.length;
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
