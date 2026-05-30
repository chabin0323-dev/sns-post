import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { LoadingState } from './types';
import type { GeneratedContent, OutputKey, Theme, HookType } from './types';
import { generateContent } from './services/loveContentGenerator';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (params: {
    theme: Theme;
    hookType: HookType;
    prevTitle: string;
    enabledKeys: OutputKey[];
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
  }) => {
    setLoadingState(LoadingState.LOADING);
    setEnabledKeys(params.enabledKeys);
    await new Promise(r => setTimeout(r, 400));
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
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* キャッチコピー */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-gray-800">
            ジャンルを入力するだけで
          </h2>
          <p className="text-2xl font-black" style={{ color: '#D4537E' }}>
            バズるSNSコンテンツが完成
          </p>
          <p className="text-xs text-gray-500 mt-2">恋愛・お金・美容・育児など全ジャンル対応</p>
        </div>

        {/* 入力フォーム */}
        <InputForm
          onGenerate={handleGenerate}
          loadingState={loadingState}
        />

        {/* 結果エリア */}
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-center text-sm font-bold">
            生成に失敗しました。もう一度お試しください。
          </div>
        )}
        {loadingState === LoadingState.SUCCESS && currentContent && (
          <div ref={resultRef}>
            <ResultCard content={currentContent} enabledKeys={enabledKeys} />
          </div>
        )}
      </main>
      <footer className="text-center py-10 text-xs text-gray-400 select-none">
        SNS投稿ジェネレーター
      </footer>
    </div>
  );
};

export default App;
