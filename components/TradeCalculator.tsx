'use client';

import { useState, useMemo } from 'react';
import { Player, DraftPick, LeagueSettings, TradeItem } from '@/lib/types';
import {
  calculatePlayerValue,
  calculatePickValue,
  createDraftPick,
  formatDraftPick,
} from '@/lib/valueCalculator';
import PlayerSearch from './PlayerSearch';
import PlayerCard from './PlayerCard';
import TradeResult from './TradeResult';

interface TradeCalculatorProps {
  players: Player[];
  settings: LeagueSettings;
}

export default function TradeCalculator({ players, settings }: TradeCalculatorProps) {
  const [teamAItems, setTeamAItems] = useState<TradeItem[]>([]);
  const [teamBItems, setTeamBItems] = useState<TradeItem[]>([]);

  // Calculate totals
  const teamATotal = useMemo(
    () => teamAItems.reduce((sum, item) => sum + item.adjustedValue, 0),
    [teamAItems]
  );

  const teamBTotal = useMemo(
    () => teamBItems.reduce((sum, item) => sum + item.adjustedValue, 0),
    [teamBItems]
  );

  // Get all selected player IDs to exclude from search
  const selectedPlayerIds = useMemo(
    () => [
      ...teamAItems.filter((i) => i.player).map((i) => i.player!.id),
      ...teamBItems.filter((i) => i.player).map((i) => i.player!.id),
    ],
    [teamAItems, teamBItems]
  );

  // Add player to team
  const addPlayer = (team: 'A' | 'B', player: Player) => {
    const adjustedValue = calculatePlayerValue(player, settings);
    const item: TradeItem = {
      type: 'player',
      player,
      adjustedValue,
    };

    if (team === 'A') {
      setTeamAItems((prev) => [...prev, item]);
    } else {
      setTeamBItems((prev) => [...prev, item]);
    }
  };

  // Add draft pick to team
  const addPick = (team: 'A' | 'B', year: number, round: 1 | 2 | 3 | 4) => {
    const pick = createDraftPick(year, round);
    const adjustedValue = calculatePickValue(pick, settings);
    const item: TradeItem = {
      type: 'pick',
      pick,
      adjustedValue,
    };

    if (team === 'A') {
      setTeamAItems((prev) => [...prev, item]);
    } else {
      setTeamBItems((prev) => [...prev, item]);
    }
  };

  // Remove item from team
  const removeItem = (team: 'A' | 'B', index: number) => {
    if (team === 'A') {
      setTeamAItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setTeamBItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Clear all items
  const clearAll = () => {
    setTeamAItems([]);
    setTeamBItems([]);
  };

  // Recalculate values when settings change
  const recalculateValues = () => {
    setTeamAItems((prev) =>
      prev.map((item) => ({
        ...item,
        adjustedValue: item.player
          ? calculatePlayerValue(item.player, settings)
          : item.pick
          ? calculatePickValue(item.pick, settings)
          : 0,
      }))
    );
    setTeamBItems((prev) =>
      prev.map((item) => ({
        ...item,
        adjustedValue: item.player
          ? calculatePlayerValue(item.player, settings)
          : item.pick
          ? calculatePickValue(item.pick, settings)
          : 0,
      }))
    );
  };

  // Recalculate when settings change
  useMemo(() => {
    recalculateValues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const DraftPickSelector = ({ team }: { team: 'A' | 'B' }) => {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedRound, setSelectedRound] = useState<1 | 2 | 3 | 4>(1);

    return (
      <div className="flex gap-2 mt-2">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
        <select
          value={selectedRound}
          onChange={(e) => setSelectedRound(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
          className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-2 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1st Round</option>
          <option value={2}>2nd Round</option>
          <option value={3}>3rd Round</option>
          <option value={4}>4th Round</option>
        </select>
        <button
          onClick={() => addPick(team, selectedYear, selectedRound)}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Add
        </button>
      </div>
    );
  };

  const TeamColumn = ({
    team,
    items,
    total,
  }: {
    team: 'A' | 'B';
    items: TradeItem[];
    total: number;
  }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Team {team}</h3>
        <span className="text-emerald-400 font-bold text-lg">{total}</span>
      </div>

      {/* Player Search */}
      <div className="mb-3">
        <PlayerSearch
          players={players}
          onSelect={(player) => addPlayer(team, player)}
          excludeIds={selectedPlayerIds}
          placeholder="Add player..."
        />
      </div>

      {/* Draft Pick Selector */}
      <DraftPickSelector team={team} />

      {/* Selected Items */}
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No players or picks added
          </p>
        ) : (
          items.map((item, index) => (
            <PlayerCard
              key={item.player?.id || item.pick?.id || index}
              player={item.player}
              pick={item.pick}
              adjustedValue={item.adjustedValue}
              onRemove={() => removeItem(team, index)}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Trade Columns */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <TeamColumn team="A" items={teamAItems} total={teamATotal} />

        {/* Divider */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-px h-full bg-slate-700 min-h-[200px]" />
        </div>
        <div className="md:hidden border-t border-slate-700" />

        <TeamColumn team="B" items={teamBItems} total={teamBTotal} />
      </div>

      {/* Clear Button */}
      {(teamAItems.length > 0 || teamBItems.length > 0) && (
        <div className="flex justify-center mb-4">
          <button
            onClick={clearAll}
            className="px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results */}
      <TradeResult teamATotal={teamATotal} teamBTotal={teamBTotal} />
    </div>
  );
}
