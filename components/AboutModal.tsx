import React from 'react';
import { X, Info, Facebook, Phone } from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-6 h-6 text-emerald-500" />
                {t.aboutTitle}
            </h3>
            <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img 
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3R1VEayvjlXrqSmdoPsDcqM5PHFKSY3QNtXcg6EDWezVsJJQ-qCv5S_MV1kqcMYTN1hw6CEETFlIFxhvQ6eyff7FBjXJxUuF1RE-VfsTDYoiaSN9bKqc_KiRfQ8eg9R4yXCiXSR228yBaicBdtPyMXW2i0bJHi3vLn3mpppANNIutOwZ2fDet9RC5WP4/s320/50804139_10216311938126877_6574927999064342528_n.jpg" 
                    alt="Developer" 
                    className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 object-cover shadow-xl"
                />
            </div>

            <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Thana Chantrapong</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t.contactLabel}</p>
            </div>

            <div className="w-full space-y-3">
                <a 
                    href="https://www.facebook.com/samongkol" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Facebook className="w-5 h-5" />
                    Facebook
                </a>
                
                <a 
                    href="tel:0645643099" 
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Phone className="w-5 h-5" />
                    064-564-3099
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;