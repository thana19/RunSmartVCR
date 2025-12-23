import React from 'react';
import { CalculationResult } from '../types';
import { Activity, Wind, Flame, Zap, Trophy, TrendingUp } from 'lucide-react';

interface ResultsProps {
  data: CalculationResult;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const formatPace = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getZoneIcon = (name: string) => {
    switch (name) {
      case 'Easy / Recovery': return <Wind className="w-5 h-5" />;
      case 'Marathon Pace': return <Activity className="w-5 h-5" />;
      case 'Threshold': return <TrendingUp className="w-5 h-5" />;
      case 'Interval': return <Flame className="w-5 h-5" />;
      case 'Repetition': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-lg flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Avg Pace</h3>
            <p className="text-3xl font-bold text-white">{formatPace(data.averagePace)} <span className="text-sm font-normal text-slate-500">/km</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5"></div>
            <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Threshold Pace</h3>
            <p className="text-4xl font-extrabold text-white relative z-10">{formatPace(data.thresholdPace)} <span className="text-sm font-normal text-slate-500">/km</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-lg flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">VO2 Max (Est)</h3>
            <p className="text-3xl font-bold text-white">{data.vo2MaxEstimate.toFixed(1)}</p>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-white">Training Zones</h3>
        </div>
        <div className="divide-y divide-slate-700">
          {data.zones.map((zone, index) => (
            <div key={index} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${zone.color} bg-opacity-20`}>
                   <div className={`${zone.color.replace('bg-', 'text-')}`}>
                     {getZoneIcon(zone.name)}
                   </div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{zone.name}</h4>
                  <p className="text-xs text-slate-400">{zone.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg text-white">
                  {formatPace(zone.maxPace)} - {formatPace(zone.minPace)}
                </div>
                <div className="text-xs text-slate-500">min/km</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;