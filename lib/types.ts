// Player and trade-related types

export type Position = 'QB' | 'RB' | 'WR' | 'TE';

export type ScoringFormat = '1QB' | 'SF' | '2QB';
export type PPRFormat = 'standard' | 'half' | 'full';
export type TEPremium = 0 | 0.5 | 1.0 | 1.5;
export type LeagueSize = 8 | 10 | 12 | 14;

export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  age: number;
  baseValue: number;
  // For PPR adjustments - higher = more catches
  receptionProfile?: 'low' | 'medium' | 'high';
}

export interface DraftPick {
  id: string;
  year: number;
  round: 1 | 2 | 3 | 4;
  originalOwner?: string;
}

export interface LeagueSettings {
  scoringFormat: ScoringFormat;
  pprFormat: PPRFormat;
  tePremium: TEPremium;
  leagueSize: LeagueSize;
}

export interface TradeItem {
  type: 'player' | 'pick';
  player?: Player;
  pick?: DraftPick;
  adjustedValue: number;
}

export interface TradeSide {
  items: TradeItem[];
  totalValue: number;
}

// Draft pick base values (will be adjusted by league settings)
export const DRAFT_PICK_VALUES: Record<number, Record<number, number>> = {
  // year -> round -> value
  2025: { 1: 85, 2: 55, 3: 30, 4: 15 },
  2026: { 1: 75, 2: 48, 3: 25, 4: 12 },
  2027: { 1: 65, 2: 40, 3: 20, 4: 10 },
};
