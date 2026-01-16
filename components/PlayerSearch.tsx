'use client';

import { useState, useRef, useEffect } from 'react';
import { Player } from '@/lib/types';

interface PlayerSearchProps {
  players: Player[];
  onSelect: (player: Player) => void;
  excludeIds?: string[];
  placeholder?: string;
}

export default function PlayerSearch({
  players,
  onSelect,
  excludeIds = [],
  placeholder = 'Search players...',
}: PlayerSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter players based on query and exclusions
  const filteredPlayers = players
    .filter((p) => !excludeIds.includes(p.id))
    .filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.team.toLowerCase().includes(query.toLowerCase()) ||
      p.position.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 8); // Limit to 8 results

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredPlayers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredPlayers[highlightedIndex]) {
          handleSelect(filteredPlayers[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (player: Player) => {
    onSelect(player);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB':
        return 'text-red-400';
      case 'RB':
        return 'text-green-400';
      case 'WR':
        return 'text-blue-400';
      case 'TE':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && filteredPlayers.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-64 overflow-auto"
        >
          {filteredPlayers.map((player, index) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                index === highlightedIndex ? 'bg-slate-600' : 'hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-medium text-xs ${getPositionColor(player.position)}`}>
                  {player.position}
                </span>
                <span className="text-white text-sm">{player.name}</span>
              </div>
              <span className="text-slate-400 text-xs">{player.team}</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && filteredPlayers.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg px-3 py-2 text-slate-400 text-sm">
          No players found
        </div>
      )}
    </div>
  );
}
