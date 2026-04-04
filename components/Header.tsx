
import React from 'react';
import { PencilSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onToggleGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleGuide }) => {
  return (
    <header className="bg-black border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <PencilSquareIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none mb-1">SNS POST GENERATOR</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini 3</p>
          </div>
        </div>
        <button 
          onClick={onToggleGuide}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
        >
          <QuestionMarkCircleIcon className="w-4 h-4" />
          <span>使い方ガイド</span>
        </button>
      </div>
    </header>
  );
};
