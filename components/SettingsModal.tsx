import React, { useState, useEffect } from 'react';
import { X, Settings, Save, Key } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // Optional: Close modal after save
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-emerald-500" />
                {t.settingsTitle}
            </h3>
            <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-300">
                    {t.settingsDesc}
                </p>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t.apiKeyPlaceholder}
                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <button 
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                <Save className="w-5 h-5" />
                {isSaved ? t.saved : t.saveBtn}
            </button>

            <div className="text-center">
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
                >
                    {t.getFreeKey}
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;