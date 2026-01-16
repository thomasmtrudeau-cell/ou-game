import {
  Player,
  DraftPick,
  LeagueSettings,
  DRAFT_PICK_VALUES,
} from './types';

/**
 * Calculate adjusted player value based on league settings
 */
export function calculatePlayerValue(
  player: Player,
  settings: LeagueSettings
): number {
  let value = player.baseValue;

  // Superflex/2QB adjustments - QBs become much more valuable
  if (settings.scoringFormat === 'SF') {
    if (player.position === 'QB') {
      value *= 2.5;
    }
  } else if (settings.scoringFormat === '2QB') {
    if (player.position === 'QB') {
      value *= 3.0;
    }
  }

  // TE Premium adjustments
  if (player.position === 'TE' && settings.tePremium > 0) {
    const tepMultiplier = 1 + (settings.tePremium * 0.2);
    value *= tepMultiplier;
  }

  // PPR adjustments - benefits high-reception players
  if (settings.pprFormat !== 'standard') {
    const pprMultiplier = settings.pprFormat === 'full' ? 1.0 : 0.5;

    if (player.receptionProfile === 'high') {
      value *= 1 + (0.1 * pprMultiplier);
    } else if (player.receptionProfile === 'low') {
      value *= 1 - (0.05 * pprMultiplier);
    }
  }

  // League size adjustments - larger leagues = depth more valuable
  if (settings.leagueSize >= 14) {
    // Depth pieces get a small boost in larger leagues
    if (value < 60) {
      value *= 1.1;
    }
  } else if (settings.leagueSize <= 8) {
    // Smaller leagues = only studs matter
    if (value < 50) {
      value *= 0.9;
    }
  }

  return Math.round(value);
}

/**
 * Calculate draft pick value based on league settings
 */
export function calculatePickValue(
  pick: DraftPick,
  settings: LeagueSettings
): number {
  const yearValues = DRAFT_PICK_VALUES[pick.year];
  if (!yearValues) {
    // Future picks beyond our data - estimate with decay
    const latestYear = Math.max(...Object.keys(DRAFT_PICK_VALUES).map(Number));
    const yearDiff = pick.year - latestYear;
    const baseValue = DRAFT_PICK_VALUES[latestYear][pick.round];
    return Math.round(baseValue * Math.pow(0.9, yearDiff));
  }

  let value = yearValues[pick.round];

  // Superflex leagues - picks are more valuable due to QB scarcity
  if (settings.scoringFormat === 'SF') {
    value *= 1.15;
  } else if (settings.scoringFormat === '2QB') {
    value *= 1.25;
  }

  // Larger leagues - picks slightly more valuable
  if (settings.leagueSize >= 14) {
    value *= 1.05;
  }

  return Math.round(value);
}

/**
 * Generate a unique ID for draft picks
 */
export function generatePickId(year: number, round: number): string {
  return `pick-${year}-${round}-${Date.now()}`;
}

/**
 * Create a draft pick object
 */
export function createDraftPick(
  year: number,
  round: 1 | 2 | 3 | 4,
  originalOwner?: string
): DraftPick {
  return {
    id: generatePickId(year, round),
    year,
    round,
    originalOwner,
  };
}

/**
 * Format draft pick for display
 */
export function formatDraftPick(pick: DraftPick): string {
  const roundSuffix = pick.round === 1 ? 'st' : pick.round === 2 ? 'nd' : pick.round === 3 ? 'rd' : 'th';
  return `${pick.year} ${pick.round}${roundSuffix}`;
}

/**
 * Determine trade winner based on total values
 */
export function getTradeResult(
  teamATotal: number,
  teamBTotal: number
): { winner: 'A' | 'B' | 'even'; margin: number; percentage: number } {
  const margin = Math.abs(teamATotal - teamBTotal);
  const average = (teamATotal + teamBTotal) / 2;
  const percentage = average > 0 ? (margin / average) * 100 : 0;

  if (percentage < 5) {
    return { winner: 'even', margin, percentage };
  }

  return {
    winner: teamATotal > teamBTotal ? 'A' : 'B',
    margin,
    percentage,
  };
}
