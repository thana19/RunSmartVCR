import React, { useState } from 'react';
import { TestDuration } from '../types';
import { Timer, Ruler, Calculator } from 'lucide-react';

interface InputFormProps {
  onCalculate: (duration: TestDuration, distance: number) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const [duration, setDuration] = useState<TestDuration>(TestDuration.MIN_30);
  const [distance, setDistance] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distance);
    if (!isNaN(distNum) && distNum > 0) {
      onCalculate(duration, distNum);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-emerald-400" />
        Input Data
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">
            Test Duration (Time Trial)
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
              <span className="font-bold">30 Mins</span>
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
              <span className="font-bold">60 Mins</span>
            </button>
          </div>
        </div>

        {/* Distance Input */}
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-slate-400 mb-2">
            Distance Covered (km)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Ruler className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="number"
              id="distance"
              step="0.01"
              required
              min="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="block w-full pl-10 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="e.g. 5.25"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Calculate VCR
        </button>
      </form>
    </div>
  );
};

export default InputForm;