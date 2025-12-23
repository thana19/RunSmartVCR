import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { getCoachingAdvice } from '../services/geminiService';
import { Sparkles, Bot, ChevronRight, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../utils/i18n';

interface AiCoachProps {
  data: CalculationResult | null;
}

const AiCoach: React.FC<AiCoachProps> = ({ data }) => {
  const { t, lang } = useTranslation();
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  // Reset when data changes significantly (optional, but good for new calculations)
  useEffect(() => {
    setAdvice('');
    setHasFetched(false);
  }, [data]);

  const handleGetAdvice = async () => {
    if (!data) return;
    setLoading(true);
    // Pass the current language to the service
    const result = await getCoachingAdvice(data, lang);
    setAdvice(result);
    setLoading(false);
    setHasFetched(true);
  };

  if (!data) return null;

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl overflow-hidden border border-indigo-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Bot className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.aiTitle}</h2>
              <p className="text-indigo-200 text-sm">{t.aiSubtitle}</p>
            </div>
          </div>
          {!hasFetched && !loading && (
            <button
              onClick={handleGetAdvice}
              className="group flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              <Sparkles className="w-4 h-4" />
              {t.analyzeBtn}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-indigo-200">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>{t.analyzing}</p>
          </div>
        )}

        {advice && (
          <div className="prose prose-invert prose-indigo max-w-none bg-black/20 p-6 rounded-xl border border-white/5">
             {/* Using a simple Markdown renderer or just displaying text with whitespace handling if simple */}
             <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
               <ReactMarkdown>{advice}</ReactMarkdown>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCoach;