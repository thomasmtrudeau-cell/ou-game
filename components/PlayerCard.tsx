'use client';

import { Player, DraftPick } from '@/lib/types';
import { formatDraftPick } from '@/lib/valueCalculator';

interface PlayerCardProps {
  player?: Player;
  pick?: DraftPick;
  adjustedValue: number;
  onRemove: () => void;
}

export default function PlayerCard({
  player,
  pick,
  adjustedValue,
  onRemove,
}: PlayerCardProps) {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'RB':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'WR':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'TE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  if (pick) {
    return (
      <div className="flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2 border border-slate-600">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
            PICK
          </span>
          <span className="text-white text-sm font-medium">
            {formatDraftPick(pick)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold text-sm">
            {adjustedValue}
          </span>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Remove pick"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (player) {
    return (
      <div className="flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2 border border-slate-600">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium border ${getPositionColor(
              player.position
            )}`}
          >
            {player.position}
          </span>
          <div>
            <span className="text-white text-sm font-medium">{player.name}</span>
            <span className="text-slate-400 text-xs ml-2">{player.team}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold text-sm">
            {adjustedValue}
          </span>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Remove player"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
