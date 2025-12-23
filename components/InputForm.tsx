import React, { useState } from 'react';
import { TestDuration } from '../types';
import { Timer, Ruler, Calculator, Gauge, MapPin } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface InputFormProps {
  onCalculate: (duration: TestDuration, distance: number) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState<TestDuration>(TestDuration.MIN_30);
  const [inputType, setInputType] = useState<'distance' | 'pace'>('distance');
  
  // Inputs
  const [distance, setDistance] = useState<string>('');
  const [paceMin, setPaceMin] = useState<string>('');
  const [paceSec, setPaceSec] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedDistance = 0;

    if (inputType === 'distance') {
      const distNum = parseFloat(distance);
      if (!isNaN(distNum) && distNum > 0) {
        calculatedDistance = distNum;
      }
    } else {
      const min = parseInt(paceMin) || 0;
      const sec = parseInt(paceSec) || 0;
      if (min > 0 || sec > 0) {
        // Calculate distance from pace
        // Duration (min) / Pace (min/km) = Distance (km)
        const totalPaceMin = min + (sec / 60);
        if (totalPaceMin > 0) {
           calculatedDistance = duration / totalPaceMin;
        }
      }
    }

    if (calculatedDistance > 0) {
      onCalculate(duration, calculatedDistance);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-emerald-400" />
        {t.inputTitle}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">
            {t.durationLabel}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDuration(TestDuration.MIN_30)}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                duration === TestDuration.MIN_30
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Timer className="w-5 h-5" />
              <span className="font-bold">30 {t.mins}</span>
            </button>
            <button
              type="button"
              onClick={() => setDuration(TestDuration.MIN_60)}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                duration === TestDuration.MIN_60
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Timer className="w-5 h-5" />
              <span className="font-bold">60 {t.mins}</span>
            </button>
          </div>
        </div>

        {/* Input Method Toggle */}
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-3">
             {t.inputMethodLabel}
           </label>
           <div className="bg-slate-900/50 p-1 rounded-xl flex">
             <button
               type="button"
               onClick={() => setInputType('distance')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                 inputType === 'distance' 
                   ? 'bg-slate-700 text-white shadow-sm' 
                   : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <MapPin className="w-4 h-4" />
               {t.byDistance}
             </button>
             <button
               type="button"
               onClick={() => setInputType('pace')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                 inputType === 'pace' 
                   ? 'bg-slate-700 text-white shadow-sm' 
                   : 'text-slate-400 hover:text-slate-200'
               }`}
             >
               <Gauge className="w-4 h-4" />
               {t.byPace}
             </button>
           </div>
        </div>

        {/* Dynamic Inputs */}
        {inputType === 'distance' ? (
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-slate-400 mb-2">
              {t.distanceLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="number"
                id="distance"
                step="0.01"
                required={inputType === 'distance'}
                min="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="block w-full pl-10 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="e.g. 5.25"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {t.paceLabel}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  required={inputType === 'pace'}
                  value={paceMin}
                  onChange={(e) => setPaceMin(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-center font-mono text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{t.min}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="00"
                  min="0"
                  max="59"
                  required={inputType === 'pace'}
                  value={paceSec}
                  onChange={(e) => setPaceSec(e.target.value)}
                  className="block w-full px-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-center font-mono text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{t.sec}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {t.calculateBtn}
        </button>
      </form>
    </div>
  );
};

export default InputForm;