"use client";

import { ViewType } from "@/lib/types";
import {
  getPlayerById,
  getPlayerAgent,
  players_sheet,
} from "@/lib/mockData";

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentPlayerId: string;
  onPlayerChange: (playerId: string) => void;
  isAdmin: boolean;
}

const navItems: { id: ViewType; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "pillars", label: "Four Pillars", icon: "layers" },
  { id: "vault", label: "The Vault", icon: "folder" },
  { id: "tasks", label: "Tasks", icon: "check-square" },
  { id: "locker", label: "My Locker", icon: "package" },
];

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "grid":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "layers":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "folder":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case "check-square":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "package":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Header({
  currentView,
  onViewChange,
  currentPlayerId,
  onPlayerChange,
  isAdmin,
}: HeaderProps) {
  const player = getPlayerById(currentPlayerId);
  const agent = getPlayerAgent(currentPlayerId);

  return (
    <header className="sticky top-0 z-50 bg-background-secondary border-b border-border">
      {/* Top bar */}
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-sv-gold font-bold text-xl tracking-tight">
              stadium ventures
            </div>
            <span className="text-foreground-muted text-sm hidden sm:inline">
              | Player Portal
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Admin: Player selector */}
            {isAdmin && (
              <select
                value={currentPlayerId}
                onChange={(e) => onPlayerChange(e.target.value)}
                className="select max-w-[200px] text-sm"
              >
                {players_sheet.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            {/* Agent contact */}
            {agent && (
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-foreground-muted">Your Agent:</span>
                <span className="text-foreground font-medium">{agent.name}</span>
                <a
                  href={`tel:${agent.phone}`}
                  className="text-sv-gold hover:text-sv-gold-hover transition-colors"
                >
                  {agent.phone}
                </a>
              </div>
            )}

            {/* User avatar */}
            {player && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-sv-navy flex items-center justify-center text-sv-gold font-semibold text-sm">
                  {player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="container-app">
        <div className="flex items-center gap-1 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item whitespace-nowrap ${
                currentView === item.id ? "active" : ""
              }`}
            >
              <NavIcon icon={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
