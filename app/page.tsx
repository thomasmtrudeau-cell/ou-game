'use client';

import { useState } from 'react';
import { LeagueSettings as LeagueSettingsType, Player } from '@/lib/types';
import LeagueSettings from '@/components/LeagueSettings';
import TradeCalculator from '@/components/TradeCalculator';
import playersData from '@/data/players.json';

const players = playersData.players as Player[];

const defaultSettings: LeagueSettingsType = {
  scoringFormat: 'SF',
  pprFormat: 'full',
  tePremium: 0,
  leagueSize: 12,
};

export default function Home() {
  const [settings, setSettings] = useState<LeagueSettingsType>(defaultSettings);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dynasty Trade Calculator
          </h1>
          <p className="text-slate-400">
            Compare trade values based on your league settings
          </p>
        </header>

        {/* League Settings */}
        <LeagueSettings settings={settings} onChange={setSettings} />

        {/* Trade Calculator */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6">
          <TradeCalculator players={players} settings={settings} />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>Values are estimates for comparison purposes only.</p>
        </footer>
      </div>
    </div>
  );
}
