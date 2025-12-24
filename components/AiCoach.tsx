import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { getCoachingAdvice, getTrainingPlan } from '../services/geminiService';
import { Sparkles, Bot, ChevronRight, Loader2, Share2, Check, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../utils/i18n';

interface AiCoachProps {
  data: CalculationResult | null;
}

const AiCoach: React.FC<AiCoachProps> = ({ data }) => {
  const { t, lang } = useTranslation();
  
  // Advice State
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  
  // Plan State
  const [plan, setPlan] = useState<string>('');
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);
  
  const [copied, setCopied] = useState<boolean>(false);

  // Reset when data changes
  useEffect(() => {
    setAdvice('');
    setPlan('');
    setLoadingAdvice(false);
    setLoadingPlan(false);
    setCopied(false);
  }, [data]);

  const handleGetAdvice = async () => {
    if (!data) return;
    setLoadingAdvice(true);
    const result = await getCoachingAdvice(data, lang);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const handleGetPlan = async () => {
    if (!data) return;
    setLoadingPlan(true);
    const result = await getTrainingPlan(data, lang);
    setPlan(result);
    setLoadingPlan(false);
  };

  const formatPace = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async (content: string, title: string) => {
    if (!data || !content) return;

    const stats = `${t.thresholdPace}: ${formatPace(data.thresholdPace)}/km\n${t.vo2Max}: ${data.vo2MaxEstimate.toFixed(1)}`;
    const textToShare = `${title}\n\n${stats}\n\n${content}\n\nVia RunSmart VCR`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: textToShare,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy', error);
      }
    }
  };

  if (!data) return null;

  return (
    <div className="mt-8 space-y-8">
      {/* General Analysis Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl overflow-hidden border border-indigo-700/50">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <Bot className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.aiTitle}</h2>
                <p className="text-indigo-200 text-sm">{t.aiSubtitle}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!advice && !loadingAdvice && (
                <button
                  onClick={handleGetAdvice}
                  className="group flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.analyzeBtn}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              
              {!plan && !loadingPlan && (
                <button
                  onClick={handleGetPlan}
                  className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  {t.planBtn}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Analysis Content */}
          {loadingAdvice && (
            <div className="py-8 flex flex-col items-center justify-center text-indigo-200 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p className="text-sm">{t.analyzing}</p>
            </div>
          )}

          {advice && (
            <div className="relative group">
              <div className="prose prose-invert prose-indigo max-w-none bg-black/20 p-6 rounded-xl border border-white/5">
                <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => handleShare(advice, t.shareTitle)}
                  className="flex items-center gap-2 text-indigo-300 hover:text-white text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                  {copied ? t.copySuccess : t.shareBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6-Week Plan Section (Visible only when loading or loaded) */}
      {(loadingPlan || plan) && (
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl shadow-xl overflow-hidden border border-emerald-700/50 animate-fade-in-up">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.planTitle}</h2>
                <p className="text-emerald-200 text-sm">Target: Improve Threshold & VO2 Max</p>
              </div>
            </div>

            {loadingPlan && (
              <div className="py-12 flex flex-col items-center justify-center text-emerald-200">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p>{t.generatingPlan}</p>
              </div>
            )}

            {plan && (
              <div className="relative">
                <div className="prose prose-invert prose-emerald max-w-none bg-black/20 p-6 rounded-xl border border-white/5">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                    <ReactMarkdown>{plan}</ReactMarkdown>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleShare(plan, t.planTitle)}
                    className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-200 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    {copied ? t.copySuccess : t.shareBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiCoach;