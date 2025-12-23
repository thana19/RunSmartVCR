import React, { useState } from 'react';
import { CalculationResult, TestDuration, TrainingZone } from './types';
import InputForm from './components/InputForm';
import Results from './components/Results';
import AiCoach from './components/AiCoach';
import { Activity } from 'lucide-react';
import { useTranslation } from './utils/i18n';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateZones = (duration: TestDuration, distanceKm: number) => {
    // 1. Calculate Average Pace (seconds per km)
    const timeInSeconds = duration * 60;
    const avgPaceSec = timeInSeconds / distanceKm;

    // 2. Estimate Threshold Pace (T-Pace)
    let tPaceSec = avgPaceSec;
    if (duration === TestDuration.MIN_30) {
      tPaceSec = avgPaceSec * 1.05; 
    }

    // 3. Estimate VO2 Max
    const distMeters = distanceKm * 1000;
    const velocityMPerMin = distMeters / duration;
    // Jack Daniels estimation formula approximation for display purposes
    const vo2Max = 0.182258 * velocityMPerMin + 4.650; 

    // 4. Define Zones based on Threshold Pace (T-Pace)
    // Using localized strings from translation hook
    
    const zones: TrainingZone[] = [
        {
            name: t.zones.easy,
            description: t.zones.easyDesc,
            minPace: tPaceSec * 1.40, 
            maxPace: tPaceSec * 1.25,
            color: 'bg-blue-500'
        },
        {
            name: t.zones.marathon,
            description: t.zones.marathonDesc,
            minPace: tPaceSec * 1.25,
            maxPace: tPaceSec * 1.10,
            color: 'bg-green-500'
        },
        {
            name: t.zones.threshold,
            description: t.zones.thresholdDesc,
            minPace: tPaceSec * 1.05,
            maxPace: tPaceSec * 0.98,
            color: 'bg-yellow-500'
        },
        {
            name: t.zones.interval,
            description: t.zones.intervalDesc,
            minPace: tPaceSec * 0.98,
            maxPace: tPaceSec * 0.90,
            color: 'bg-orange-500'
        },
        {
            name: t.zones.repetition,
            description: t.zones.repetitionDesc,
            minPace: tPaceSec * 0.90,
            maxPace: tPaceSec * 0.85, 
            color: 'bg-red-500'
        }
    ];

    setResult({
      distance: distanceKm,
      duration,
      averagePace: avgPaceSec,
      thresholdPace: tPaceSec,
      vo2MaxEstimate: vo2Max,
      zones
    });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <Activity className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-white tracking-tight">{t.title}</h1>
                <p className="text-xs text-slate-400">{t.subtitle}</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="prose prose-invert">
            <h2 className="text-2xl font-bold mb-2">{t.sectionTitle}</h2>
            <p className="text-slate-400 text-sm mb-6">
              {t.sectionDesc}
            </p>
          </div>
          <InputForm onCalculate={calculateZones} />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          {result ? (
            <>
              <Results data={result} />
              <AiCoach data={result} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-800/50 rounded-3xl border border-dashed border-slate-700 p-12 text-center">
               <Activity className="w-16 h-16 text-slate-600 mb-4" />
               <h3 className="text-xl font-bold text-slate-400 mb-2">{t.noDataTitle}</h3>
               <p className="text-slate-500 max-w-sm">
                 {t.noDataDesc}
               </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;