"use client";

import { useState } from "react";
import { getPlayerFiles } from "@/lib/mockData";

interface VaultViewProps {
  playerId: string;
}

const categoryIcons: Record<string, string> = {
  Contracts:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  Onboarding:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  Performance:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  Recruiting:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  Training:
    "M13 10V3L4 14h7v7l9-11h-7z",
  Medical:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
};

const categoryColors: Record<string, string> = {
  Contracts: "#d4a853",
  Onboarding: "#3b82f6",
  Performance: "#22c55e",
  Recruiting: "#8b5cf6",
  Training: "#ef4444",
  Medical: "#f59e0b",
};

export default function VaultView({ playerId }: VaultViewProps) {
  const files = getPlayerFiles(playerId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(files.map((f) => f.category))];

  const filteredFiles = selectedCategory
    ? files.filter((f) => f.category === selectedCategory)
    : files;

  const sortedFiles = [...filteredFiles].sort((a, b) =>
    b.upload_date.localeCompare(a.upload_date)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">The Vault</h1>
        <p className="text-foreground-muted">
          Access all your documents, reports, and files in one secure location.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`btn ${
            selectedCategory === null ? "btn-primary" : "btn-secondary"
          }`}
        >
          All Documents
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn ${
              selectedCategory === category ? "btn-primary" : "btn-secondary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedFiles.map((file) => {
          const color = categoryColors[file.category] || "#94a3b8";
          const icon =
            categoryIcons[file.category] ||
            "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";

          return (
            <a
              key={file.id}
              href={file.link}
              className="card card-hover flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={color}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={icon}
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {file.file_name}
                  </h3>
                  <div
                    className="text-sm font-medium mt-1"
                    style={{ color }}
                  >
                    {file.category}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-foreground-muted text-sm">
                  {new Date(file.upload_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
            </a>
          );
        })}
      </div>

      {sortedFiles.length === 0 && (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-foreground-muted mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No documents found
          </h3>
          <p className="text-foreground-muted">
            {selectedCategory
              ? `No documents in the ${selectedCategory} category.`
              : "Your documents will appear here once uploaded."}
          </p>
        </div>
      )}
    </div>
  );
}
