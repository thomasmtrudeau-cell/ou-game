"use client";

import {
  getPlayerById,
  getPlayerAgent,
  getPlayerGoals,
  getPlayerTasks,
  getPlayerFiles,
  getFourPillarsProgress,
  getOnboardingProgress,
  getPlayerCollegePrefs,
} from "@/lib/mockData";
import { ViewType } from "@/lib/types";

interface DashboardProps {
  playerId: string;
  onViewChange: (view: ViewType) => void;
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-background-tertiary rounded-lg p-4">
      <div className="text-foreground-muted text-xs uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {subtext && (
        <div className="text-foreground-muted text-sm mt-1">{subtext}</div>
      )}
    </div>
  );
}

function ProgressRing({
  percentage,
  color,
  size = 60,
}: {
  percentage: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--background-tertiary)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {percentage}%
      </div>
    </div>
  );
}

const pillarColors: Record<string, string> = {
  Physical: "#ef4444",
  Mental: "#8b5cf6",
  Technique: "#3b82f6",
  Nutrition: "#22c55e",
};

export default function Dashboard({ playerId, onViewChange }: DashboardProps) {
  const player = getPlayerById(playerId);
  const agent = getPlayerAgent(playerId);
  const goals = getPlayerGoals(playerId);
  const tasks = getPlayerTasks(playerId);
  const files = getPlayerFiles(playerId);
  const pillarsProgress = getFourPillarsProgress(playerId);
  const onboardingProgress = getOnboardingProgress(playerId);
  const collegePrefs = getPlayerCollegePrefs(playerId);

  if (!player) {
    return <div className="p-8 text-foreground-muted">Player not found</div>;
  }

  const playerGoals = goals.filter((g) => g.type === "player");
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const upcomingTasks = [...inProgressTasks, ...pendingTasks].slice(0, 4);
  const recentFiles = [...files].sort((a, b) =>
    b.upload_date.localeCompare(a.upload_date)
  ).slice(0, 3);

  const levelClass = {
    "High School": "level-highschool",
    College: "level-college",
    MiLB: "level-milb",
    MLB: "level-mlb",
  }[player.level];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Welcome back, {player.name.split(" ")[0]}
            </h1>
            <div className="flex items-center gap-3 text-foreground-muted">
              <span
                className={`badge text-white text-xs ${levelClass}`}
              >
                {player.level}
              </span>
              <span>{player.position}</span>
              <span>|</span>
              <span>{player.high_school}</span>
            </div>
          </div>

          {/* Onboarding progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-foreground-muted text-sm">
                Onboarding Progress
              </div>
              <div className="text-foreground font-semibold">
                {onboardingProgress.completed} of {onboardingProgress.total} steps
              </div>
            </div>
            <ProgressRing
              percentage={onboardingProgress.percentage}
              color="var(--sv-gold)"
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Height" value={player.height} />
        <StatCard
          label="Weight"
          value={`${player.weight} lbs`}
          subtext={`Goal: ${player.ideal_weight} lbs`}
        />
        <StatCard
          label="Exit Velo"
          value={player.exit_velo || "—"}
          subtext={player.exit_velo ? "mph" : "Not recorded"}
        />
        <StatCard
          label="Arm Velo"
          value={player.arm_velo || "—"}
          subtext={player.arm_velo ? "mph" : "Not recorded"}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Four Pillars overview */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Four Pillars Progress
            </h2>
            <button
              onClick={() => onViewChange("pillars")}
              className="text-sv-gold text-sm hover:text-sv-gold-hover transition-colors"
            >
              View Details →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillarsProgress.map((pillar) => (
              <div
                key={pillar.pillar}
                className="flex flex-col items-center p-4 rounded-lg border border-border"
              >
                <ProgressRing
                  percentage={pillar.percentage}
                  color={pillarColors[pillar.pillar]}
                  size={70}
                />
                <div
                  className="mt-3 font-medium text-sm"
                  style={{ color: pillarColors[pillar.pillar] }}
                >
                  {pillar.pillar}
                </div>
                <div className="text-foreground-muted text-xs">
                  {pillar.completed}/{pillar.total} complete
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent contact card */}
        {agent && (
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Agent
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-sv-navy flex items-center justify-center text-sv-gold font-bold text-lg">
                {agent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-semibold text-foreground">{agent.name}</div>
                <div className="text-foreground-muted text-sm">{agent.role}</div>
              </div>
            </div>
            <div className="space-y-2">
              <a
                href={`tel:${agent.phone}`}
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-sv-gold transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {agent.phone}
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-2 text-sm text-foreground-muted hover:text-sv-gold transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {agent.email}
              </a>
            </div>
          </div>
        )}

        {/* Upcoming tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Tasks
            </h2>
            <button
              onClick={() => onViewChange("tasks")}
              className="text-sv-gold text-sm hover:text-sv-gold-hover transition-colors"
            >
              View All →
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <p className="text-foreground-muted text-sm">No pending tasks!</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-background rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      task.status === "in_progress"
                        ? "bg-info"
                        : "bg-warning"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium truncate">
                      {task.task_name}
                    </div>
                    <div className="text-foreground-muted text-xs">
                      Due:{" "}
                      {new Date(task.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <span
                    className={`badge text-xs ${
                      task.status === "in_progress"
                        ? "badge-info"
                        : "badge-warning"
                    }`}
                  >
                    {task.status === "in_progress" ? "In Progress" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            My Goals
          </h2>
          <div className="space-y-3">
            {playerGoals.map((goal, index) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 bg-background rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-sv-navy text-sv-gold flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-foreground text-sm">{goal.goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent documents */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Documents
            </h2>
            <button
              onClick={() => onViewChange("vault")}
              className="text-sv-gold text-sm hover:text-sv-gold-hover transition-colors"
            >
              View Vault →
            </button>
          </div>

          <div className="space-y-3">
            {recentFiles.map((file) => (
              <a
                key={file.id}
                href={file.link}
                className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-background-tertiary transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-sv-navy flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-sv-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium truncate">
                    {file.file_name}
                  </div>
                  <div className="text-foreground-muted text-xs">
                    {file.category}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* College preferences (for HS/College players) */}
      {(player.level === "High School" || player.level === "College") &&
        collegePrefs.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              College Target List
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {collegePrefs.slice(0, 10).map((pref) => (
                <div
                  key={pref.id}
                  className={`p-3 rounded-lg border text-center ${
                    pref.contacted
                      ? "border-success bg-success-muted/20"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="text-foreground font-medium text-sm">
                    {pref.school}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      pref.contacted ? "text-success" : "text-foreground-muted"
                    }`}
                  >
                    {pref.contacted ? "Contacted" : "Not contacted"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
