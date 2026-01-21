// =============================================================================
// SV ONBOARDING PROTOTYPE - Type Definitions
// =============================================================================

// Player levels
export type PlayerLevel = "High School" | "College" | "MiLB" | "MLB";

// Training budget tiers
export type TrainingBudget = "$" | "$$" | "$$$";

// Onboarding status
export type OnboardingStatus = "not_started" | "in_progress" | "complete";

// Task status
export type TaskStatus = "pending" | "in_progress" | "complete";

// Gear request status
export type GearStatus = "pending" | "approved" | "shipped" | "delivered";

// Four Pillars categories
export type PillarType = "Physical" | "Mental" | "Technique" | "Nutrition";

// Goal type
export type GoalType = "player" | "sv";

// Player record (matches players_sheet)
export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: PlayerLevel;
  position: string;
  height: string;
  weight: number;
  ideal_weight: number;
  sixty_time: string;
  exit_velo: string;
  arm_velo: string;
  training_budget: TrainingBudget;
  high_school: string;
  travel_team: string;
  facility: string;
  agent_id: string;
  onboarding_date: string;
  onboarding_status: OnboardingStatus;
  profile_image: string;
}

// Agent record (matches agents_sheet)
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Goal record (matches goals_sheet)
export interface Goal {
  id: string;
  player_id: string;
  type: GoalType;
  priority: number;
  goal: string;
}

// Schedule record (matches schedule_sheet)
export interface ScheduleDay {
  id: string;
  player_id: string;
  day: string;
  lift: boolean;
  practice: boolean;
  training: boolean;
}

// College preference record (matches college_preferences_sheet)
export interface CollegePreference {
  id: string;
  player_id: string;
  rank: number;
  school: string;
  contacted: boolean;
}

// Four Pillars item record (matches four_pillars_sheet)
export interface FourPillarsItem {
  id: string;
  player_id: string;
  pillar: PillarType;
  item: string;
  need: boolean;
  complete: boolean;
  notes: string;
}

// Task record (matches tasks_sheet)
export interface Task {
  id: string;
  player_id: string;
  task_name: string;
  category: string;
  due_date: string;
  status: TaskStatus;
}

// File record (matches files_sheet)
export interface FileRecord {
  id: string;
  player_id: string;
  file_name: string;
  category: string;
  upload_date: string;
  link: string;
}

// Gear request record (matches gear_requests_sheet)
export interface GearRequest {
  id: string;
  player_id: string;
  item_name: string;
  size: string;
  quantity: number;
  status: GearStatus;
  request_date: string;
}

// Note record (matches notes_sheet)
export interface Note {
  id: string;
  player_id: string;
  date: string;
  author: string;
  note: string;
}

// Four Pillars progress summary
export interface PillarProgress {
  pillar: string;
  completed: number;
  total: number;
  percentage: number;
}

// Onboarding progress summary
export interface OnboardingProgress {
  completed: number;
  total: number;
  percentage: number;
}

// Navigation view types
export type ViewType = "dashboard" | "pillars" | "vault" | "tasks" | "locker" | "profile";

// App context state
export interface AppState {
  currentPlayerId: string;
  currentView: ViewType;
  isAdmin: boolean;
}
