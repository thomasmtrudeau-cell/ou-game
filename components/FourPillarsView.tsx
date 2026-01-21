"use client";

import { getPlayerFourPillars, getFourPillarsProgress } from "@/lib/mockData";

interface FourPillarsViewProps {
  playerId: string;
}

const pillarConfig: Record<
  string,
  { color: string; bgClass: string; icon: string }
> = {
  Physical: {
    color: "#ef4444",
    bgClass: "pillar-physical-bg",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  Mental: {
    color: "#8b5cf6",
    bgClass: "pillar-mental-bg",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  Technique: {
    color: "#3b82f6",
    bgClass: "pillar-technique-bg",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Nutrition: {
    color: "#22c55e",
    bgClass: "pillar-nutrition-bg",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
  },
};

export default function FourPillarsView({ playerId }: FourPillarsViewProps) {
  const items = getPlayerFourPillars(playerId);
  const progress = getFourPillarsProgress(playerId);

  const pillars = ["Physical", "Mental", "Technique", "Nutrition"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-foreground mb-2">Four Pillars</h1>
        <p className="text-foreground-muted">
          Track your development across all four pillars of athletic excellence.
        </p>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {progress.map((p) => {
          const config = pillarConfig[p.pillar];
          return (
            <div
              key={p.pillar}
              className={`card border ${config.bgClass}`}
              style={{ borderColor: config.color }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke={config.color}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={config.icon}
                    />
                  </svg>
                </div>
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: config.color }}
                  >
                    {p.pillar}
                  </div>
                  <div className="text-foreground-muted text-xs">
                    {p.completed}/{p.total} complete
                  </div>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${p.percentage}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
              <div className="text-right mt-2 text-sm font-semibold" style={{ color: config.color }}>
                {p.percentage}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Pillar details */}
      {pillars.map((pillar) => {
        const config = pillarConfig[pillar];
        const pillarItems = items.filter((i) => i.pillar === pillar);

        return (
          <div key={pillar} className="card">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke={config.color}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={config.icon}
                  />
                </svg>
              </div>
              <h2
                className="text-lg font-semibold"
                style={{ color: config.color }}
              >
                {pillar}
              </h2>
            </div>

            <div className="space-y-3">
              {pillarItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.complete
                      ? "bg-success-muted/10 border-success/30"
                      : "bg-background border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.complete
                          ? "bg-success text-white"
                          : "bg-background-tertiary text-foreground-muted"
                      }`}
                    >
                      {item.complete ? (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          item.complete
                            ? "text-success"
                            : "text-foreground"
                        }`}
                      >
                        {item.item}
                      </div>
                      {item.notes && (
                        <div className="text-foreground-muted text-sm mt-1">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.need && (
                      <span className="badge badge-warning text-xs">
                        Needed
                      </span>
                    )}
                    <span
                      className={`badge text-xs ${
                        item.complete ? "badge-success" : "badge-neutral"
                      }`}
                    >
                      {item.complete ? "Complete" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
