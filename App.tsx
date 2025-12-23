import React, { useState } from 'react';
import { CalculationResult, TestDuration, TrainingZone } from './types';
import InputForm from './components/InputForm';
import Results from './components/Results';
import AiCoach from './components/AiCoach';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateZones = (duration: TestDuration, distanceKm: number) => {
    // 1. Calculate Average Pace (seconds per km)
    const timeInSeconds = duration * 60;
    const avgPaceSec = timeInSeconds / distanceKm;

    // 2. Estimate Threshold Pace (T-Pace)
    // If 60 min test, Avg Pace = T-Pace
    // If 30 min test, Avg Pace is ~faster than T-Pace. 
    // Joe Friel / Jack Daniels approx: 30min race pace is roughly 102-105% of T-Pace intensity.
    // So T-Pace (slower) = AvgPace * 1.05 (approx for simplicity and safety)
    let tPaceSec = avgPaceSec;
    if (duration === TestDuration.MIN_30) {
      tPaceSec = avgPaceSec * 1.05; 
    }

    // 3. Estimate VO2 Max
    // Simple formula based on distance in meters for specific times
    // Or standard metabolic cost formula.
    // Approx VO2 = (Velocity m/min - 133) * 0.172 + 33.3 (very rough, let's use a simpler distance based reg)
    // Cooper (12m): (Dist_m - 504.9) / 44.73.
    // Let's extrapolate Cooper.
    const distMeters = distanceKm * 1000;
    const velocityMPerMin = distMeters / duration;
    // Jack Daniels estimation formula approximation for display purposes
    const vo2Max = 0.182258 * velocityMPerMin + 4.650; // VERY rough approximation for steady state

    // 4. Define Zones based on Threshold Pace (T-Pace)
    // Zone 1 (Easy): 120-140% of T-Pace (Slower) -> T-Pace * 1.2 to 1.4
    // Zone 2 (Marathon): 110-120%
    // Zone 3 (Threshold): 98-105% (Around T-Pace)
    // Zone 4 (Interval): 90-98% (Faster)
    // Zone 5 (Repetition): < 90%
    
    // Note: Pace is inverse of speed. Higher % of T-Pace Speed = Lower % of T-Pace Time.
    // Let's stick to Speed percentages converted to Pace.
    // T-Speed = 1 / tPaceSec
    
    const zones: TrainingZone[] = [
        {
            name: 'Easy / Recovery',
            description: 'Warm up, cool down, and recovery runs. Builds aerobic base.',
            minPace: tPaceSec * 1.40, 
            maxPace: tPaceSec * 1.25,
            color: 'bg-blue-500'
        },
        {
            name: 'Marathon Pace',
            description: 'Steady aerobic running. Used for long runs.',
            minPace: tPaceSec * 1.25,
            maxPace: tPaceSec * 1.10,
            color: 'bg-green-500'
        },
        {
            name: 'Threshold',
            description: 'Comfortably hard. Improves lactate clearance.',
            minPace: tPaceSec * 1.05,
            maxPace: tPaceSec * 0.98,
            color: 'bg-yellow-500'
        },
        {
            name: 'Interval',
            description: 'Hard effort. Improves VO2 Max.',
            minPace: tPaceSec * 0.98,
            maxPace: tPaceSec * 0.90,
            color: 'bg-orange-500'
        },
        {
            name: 'Repetition',
            description: 'Very hard. Improves speed and economy.',
            minPace: tPaceSec * 0.90,
            maxPace: tPaceSec * 0.85, // Cap at some reasonable fast pace
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
                <h1 className="text-xl font-bold text-white tracking-tight">RunSmart <span className="text-emerald-400">VCR</span></h1>
                <p className="text-xs text-slate-400">Velocity & Capacity Calculator</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="prose prose-invert">
            <h2 className="text-2xl font-bold mb-2">Calculate Your Zones</h2>
            <p className="text-slate-400 text-sm mb-6">
              Enter your results from a 30-minute or 60-minute all-out time trial to determine your Threshold Pace and personalized training zones.
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
               <h3 className="text-xl font-bold text-slate-400 mb-2">No Data Yet</h3>
               <p className="text-slate-500 max-w-sm">
                 Complete the form on the left to see your VCR analysis, threshold pace, and AI coaching insights.
               </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;