'use client';

interface TradeResultProps {
  teamATotal: number;
  teamBTotal: number;
}

export default function TradeResult({ teamATotal, teamBTotal }: TradeResultProps) {
  const margin = Math.abs(teamATotal - teamBTotal);
  const average = (teamATotal + teamBTotal) / 2;
  const percentage = average > 0 ? (margin / average) * 100 : 0;

  const getWinner = () => {
    if (percentage < 5) return 'even';
    return teamATotal > teamBTotal ? 'A' : 'B';
  };

  const winner = getWinner();

  if (teamATotal === 0 && teamBTotal === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-center">
        <p className="text-slate-400">Add players or picks to see the comparison</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      {/* Value Bars */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Team A</span>
            <span className="text-white font-semibold">{teamATotal}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                winner === 'A' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, (teamATotal / Math.max(teamATotal, teamBTotal, 1)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Team B</span>
            <span className="text-white font-semibold">{teamBTotal}</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                winner === 'B' ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, (teamBTotal / Math.max(teamATotal, teamBTotal, 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Result Text */}
      <div className="text-center pt-2 border-t border-slate-700">
        {winner === 'even' ? (
          <div>
            <p className="text-xl font-bold text-yellow-400">Fair Trade</p>
            <p className="text-slate-400 text-sm">
              Values within 5% - pretty even!
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-bold text-emerald-400">
              Team {winner} Wins
            </p>
            <p className="text-slate-400 text-sm">
              By {margin} points ({percentage.toFixed(1)}% advantage)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
