// App.tsx（完全版）
// 既存コードに以下を追加:
//   - import BuzzPostPanel
//   - import generateBuzzPost
//   - buzzResult / isBuzzLoading の2ステート
//   - handleBuzzGenerate ハンドラ
//   - <BuzzPostPanel> を InputForm の下に配置
// 既存の handleGenerate / currentContent / enabledKeys は一切変更なし

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { BuzzPostPanel } from './components/BuzzPostPanel';
import { LoadingState } from './types';
import type { GeneratedContent, OutputKey, Genre, Theme, BuzzPostResult } from './types';
import { generateContent } from './services/loveContentGenerator';
import { generateBuzzPost } from './services/buzzPostGenerator';

const RESULT_STORAGE_KEY = 'sns_post_last_result_v2';

const App: React.FC = () => {
  // ============================================================
  // 既存ステート（変更なし）
  // ============================================================
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // 新規追加ステート（BuzzPost用）
  // ============================================================
  const [buzzResult, setBuzzResult] = useState<BuzzPostResult | null>(null);
  const [isBuzzLoading, setIsBuzzLoading] = useState(false);
  const buzzRef = useRef<HTMLDivElement>(null);

  // InputFormの現在設定を保持（BuzzPostPanelへ渡すため）
  const [currentSettings, setCurrentSettings] = useState<{
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
  }>({
    tiktokLength: 300,
    profileCta: '',
    postUrl: '',
  });

  // ============================================================
  // 起動時に前回の生成結果を復元（既存ロジック・変更なし）
  // ============================================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RESULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { content: GeneratedContent; enabledKeys: OutputKey[] };
        if (parsed.content && parsed.enabledKeys) {
          setCurrentContent(parsed.content);
          setEnabledKeys(parsed.enabledKeys);
          setLoadingState(LoadingState.SUCCESS);
        }
      }
    } catch {
      // 復元失敗時は無視
    }
  }, []);

  // ============================================================
  // 既存ハンドラ（変更なし）
  // ============================================================
  const handleGenerate = async (params: {
    genre: Genre;
    theme: Theme;
    prevTitle: string;
    enabledKeys: OutputKey[];
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
    freeTheme?: string;
  }) => {
    setLoadingState(LoadingState.LOADING);
    setEnabledKeys(params.enabledKeys);

    // 現在の設定をBuzzPostPanel用に保持
    setCurrentSettings({
      tiktokLength: params.tiktokLength,
      profileCta: params.profileCta,
      postUrl: params.postUrl,
    });

    await new Promise(r => setTimeout(r, 500));
    try {
      const result = generateContent(params);
      setCurrentContent(result);
      setLoadingState(LoadingState.SUCCESS);
      try {
        localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify({
          content: result,
          enabledKeys: params.enabledKeys,
        }));
      } catch {
        // 保存失敗時は無視
      }
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setLoadingState(LoadingState.ERROR);
    }
  };

  // ============================================================
  // 新規ハンドラ（BuzzPost生成）
  // ============================================================
  const handleBuzzGenerate = async (articleText: string, length: 300 | 500 | 600) => {
    setIsBuzzLoading(true);
    // わずかなローディング感を演出（UX向上）
    await new Promise(r => setTimeout(r, 400));
    try {
      const result = generateBuzzPost({
        articleText,
        tiktokLength: length,
        profileCta: currentSettings.profileCta,
        postUrl: currentSettings.postUrl,
      });
      setBuzzResult(result);
      setTimeout(() => {
        buzzRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      // エラー時は静かに失敗
    } finally {
      setIsBuzzLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF0F5' }}>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* キャッチコピー（既存・変更なし） */}
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

        {/* バッジ（既存・変更なし） */}
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

        {/* 入力フォーム（既存・変更なし） */}
        <InputForm onGenerate={handleGenerate} loadingState={loadingState} />

        {/* エラー表示（既存・変更なし） */}
        {loadingState === LoadingState.ERROR && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-center text-sm font-bold">
            ⚠️ 生成に失敗しました。もう一度お試しください。
          </div>
        )}

        {/* 生成結果（既存・変更なし） */}
        {loadingState === LoadingState.SUCCESS && currentContent && (
          <div ref={resultRef}>
            <ResultCard content={currentContent} enabledKeys={enabledKeys} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 新規追加：BuzzPostPanel（既存コンポーネントとは完全に分離） */}
        {/* ============================================================ */}
        <div ref={buzzRef}>
          <BuzzPostPanel
            profileCta={currentSettings.profileCta}
            postUrl={currentSettings.postUrl}
            onGenerate={handleBuzzGenerate}
            result={buzzResult}
            isLoading={isBuzzLoading}
          />
        </div>

      </main>
      <footer className="text-center py-8 text-xs text-gray-400 select-none space-y-1">
        <p className="font-bold text-gray-500">SNS投稿ジェネレーター 2026</p>
        <p>10ジャンル対応 · APIキー不要 · 完全無料</p>
      </footer>
    </div>
  );
};

export default App;
