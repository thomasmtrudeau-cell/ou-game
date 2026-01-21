"use client";

import { useState } from "react";
import { getPlayerTasks } from "@/lib/mockData";

interface TasksViewProps {
  playerId: string;
}

export default function TasksView({ playerId }: TasksViewProps) {
  const tasks = getPlayerTasks(playerId);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "complete">("all");

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by status priority, then by due date
    const statusOrder: Record<string, number> = { in_progress: 0, pending: 1, complete: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.due_date.localeCompare(b.due_date);
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    complete: tasks.filter((t) => t.status === "complete").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return "badge-success";
      case "in_progress":
        return "badge-info";
      case "pending":
        return "badge-warning";
      default:
        return "badge-neutral";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "complete") return false;
    const today = new Date().toISOString().split("T")[0];
    return dueDate < today;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">Tasks</h1>
        <p className="text-foreground-muted">
          Stay on top of your onboarding and ongoing tasks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`card text-left transition-all ${
            filter === "all" ? "ring-2 ring-sv-gold" : ""
          }`}
        >
          <div className="text-foreground-muted text-sm">Total Tasks</div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`card text-left transition-all ${
            filter === "pending" ? "ring-2 ring-warning" : ""
          }`}
        >
          <div className="text-warning text-sm">Pending</div>
          <div className="text-2xl font-bold text-warning">{stats.pending}</div>
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`card text-left transition-all ${
            filter === "in_progress" ? "ring-2 ring-info" : ""
          }`}
        >
          <div className="text-info text-sm">In Progress</div>
          <div className="text-2xl font-bold text-info">{stats.inProgress}</div>
        </button>
        <button
          onClick={() => setFilter("complete")}
          className={`card text-left transition-all ${
            filter === "complete" ? "ring-2 ring-success" : ""
          }`}
        >
          <div className="text-success text-sm">Complete</div>
          <div className="text-2xl font-bold text-success">{stats.complete}</div>
        </button>
      </div>

      {/* Task list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {filter === "all"
              ? "All Tasks"
              : `${getStatusLabel(filter)} Tasks`}
          </h2>
          <span className="text-foreground-muted text-sm">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);

            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  task.status === "complete"
                    ? "bg-success-muted/10 border-success/20"
                    : overdue
                    ? "bg-error-muted/10 border-error/30"
                    : "bg-background border-border hover:border-sv-gold/50"
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    task.status === "complete"
                      ? "bg-success text-white"
                      : task.status === "in_progress"
                      ? "bg-info text-white"
                      : "bg-background-tertiary text-foreground-muted"
                  }`}
                >
                  {task.status === "complete" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : task.status === "in_progress" ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-current" />
                  )}
                </div>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium ${
                      task.status === "complete"
                        ? "text-success line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.task_name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-foreground-muted text-sm">
                      {task.category}
                    </span>
                    <span className="text-foreground-muted">|</span>
                    <span
                      className={`text-sm ${
                        overdue ? "text-error font-medium" : "text-foreground-muted"
                      }`}
                    >
                      {overdue ? "Overdue: " : "Due: "}
                      {new Date(task.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`badge ${getStatusBadge(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
            );
          })}
        </div>

        {sortedTasks.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto text-foreground-muted mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-foreground-muted">
              No {filter !== "all" ? filter.replace("_", " ") : ""} tasks found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
