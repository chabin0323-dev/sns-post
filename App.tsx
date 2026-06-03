import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { LoadingState } from './types';
import type { GeneratedContent, OutputKey, Genre, Theme } from './types';
import { generateContent } from './services/loveContentGenerator';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (params: {
    genre: Genre;
    theme: Theme;
    prevTitle: string;
    enabledKeys: OutputKey[];
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
  }) => {
    setLoadingState(LoadingState.LOADING);
    setEnabledKeys(params.enabledKeys);
    await new Promise(r => setTimeout(r, 500));
    try {
      const result = generateContent(params);
      setCurrentContent(result);
      setLoadingState(LoadingState.SUCCESS);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF0F5' }}>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-1 py-2">
          <h2 className="text-2xl font-black text-gray-800">10ジャンル・全テーマ対応</h2>
          <p
            className="text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #F472B6, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            2026年バズる投稿が即完成
          </p>
          <p className="text-xs text-gray-500 mt-1">APIキー不要・ローカル生成・完全無料</p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {[
            { icon: '🎯', text: '10ジャンル対応' },
            { icon: '📝', text: '100+テーマ' },
            { icon: '✨', text: 'フック自動選択' },
            { icon: '⚡', text: '即時生成' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-pink-100">
              <span className="text-sm">{icon}</span>
              <span className="text-xs font-bold text-gray-600">{text}</span>
            </div>
          ))}
        </div>
        <InputForm onGenerate={handleGenerate} loadingState={loadingState} />
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-center text-sm font-bold">
            ⚠️ 生成に失敗しました。もう一度お試しください。
          </div>
        )}
        {loadingState === LoadingState.SUCCESS && currentContent && (
          <div ref={resultRef}>
            <ResultCard content={currentContent} enabledKeys={enabledKeys} />
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-xs text-gray-400 select-none space-y-1">
        <p className="font-bold text-gray-500">SNS投稿ジェネレーター 2026</p>
        <p>10ジャンル対応 · APIキー不要 · 完全無料</p>
      </footer>
    </div>
  );
};

export default App;
