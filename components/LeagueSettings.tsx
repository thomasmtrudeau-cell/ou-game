'use client';

import { LeagueSettings as LeagueSettingsType, ScoringFormat, PPRFormat, TEPremium, LeagueSize } from '@/lib/types';

interface LeagueSettingsProps {
  settings: LeagueSettingsType;
  onChange: (settings: LeagueSettingsType) => void;
}

export default function LeagueSettings({ settings, onChange }: LeagueSettingsProps) {
  const updateSetting = <K extends keyof LeagueSettingsType>(
    key: K,
    value: LeagueSettingsType[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">League Settings</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Scoring Format */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Format
          </label>
          <select
            value={settings.scoringFormat}
            onChange={(e) => updateSetting('scoringFormat', e.target.value as ScoringFormat)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1QB">1QB</option>
            <option value="SF">Superflex</option>
            <option value="2QB">2QB</option>
          </select>
        </div>

        {/* PPR Format */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            PPR
          </label>
          <select
            value={settings.pprFormat}
            onChange={(e) => updateSetting('pprFormat', e.target.value as PPRFormat)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Non-PPR</option>
            <option value="half">Half PPR</option>
            <option value="full">Full PPR</option>
          </select>
        </div>

        {/* TE Premium */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            TE Premium
          </label>
          <select
            value={settings.tePremium}
            onChange={(e) => updateSetting('tePremium', parseFloat(e.target.value) as TEPremium)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>None</option>
            <option value={0.5}>+0.5 PPR</option>
            <option value={1}>+1.0 PPR</option>
            <option value={1.5}>+1.5 PPR</option>
          </select>
        </div>

        {/* League Size */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Teams
          </label>
          <select
            value={settings.leagueSize}
            onChange={(e) => updateSetting('leagueSize', parseInt(e.target.value) as LeagueSize)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={8}>8 Teams</option>
            <option value={10}>10 Teams</option>
            <option value={12}>12 Teams</option>
            <option value={14}>14 Teams</option>
          </select>
        </div>
      </div>
    </div>
  );
}
