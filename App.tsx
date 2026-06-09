// App.tsx
// タブ切り替え版：①note記事生成 ②バズる投稿生成
// 既存の handleGenerate / currentContent / enabledKeys / ResultCard は一切変更なし

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

type TabType = 'note' | 'buzz';

const App: React.FC = () => {
  // ============================================================
  // タブ状態
  // ============================================================
  const [activeTab, setActiveTab] = useState<TabType>('note');

  // ============================================================
  // 既存ステート（変更なし）
  // ============================================================
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // BuzzPost用ステート（変更なし）
  // ============================================================
  const [buzzResult, setBuzzResult] = useState<BuzzPostResult | null>(null);
  const [isBuzzLoading, setIsBuzzLoading] = useState(false);
  const buzzRef = useRef<HTMLDivElement>(null);

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
  // 起動時に前回の生成結果を復元（変更なし）
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
      } catch { /* 保存失敗は無視 */ }
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setLoadingState(LoadingState.ERROR);
    }
  };

  // ============================================================
  // BuzzPost生成ハンドラ（変更なし）
  // ============================================================
  const handleBuzzGenerate = async (articleText: string, length: 300 | 500 | 600) => {
    setIsBuzzLoading(true);
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
    } catch { /* エラーは無視 */ }
    finally { setIsBuzzLoading(false); }
  };

  // ============================================================
  // タブスタイル
  // ============================================================
  const tabBase: React.CSSProperties = {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.3px',
  };

  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: 'linear-gradient(135deg, #F472B6, #D4537E)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(212,83,126,0.35)',
  };

  const tabInactive: React.CSSProperties = {
    ...tabBase,
    backgroundColor: '#fff',
    color: '#9ca3af',
    boxShadow: 'none',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF0F5' }}>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* キャッチコピー */}
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

        {/* バッジ */}
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

        {/* ============================================================ */}
        {/* タブ切り替え */}
        {/* ============================================================ */}
        <div style={{
          display: 'flex',
          gap: '6px',
          backgroundColor: '#fce7f3',
          borderRadius: '18px',
          padding: '6px',
        }}>
          <button
            onClick={() => setActiveTab('note')}
            style={activeTab === 'note' ? tabActive : tabInactive}
          >
            📝 note記事生成
          </button>
          <button
            onClick={() => setActiveTab('buzz')}
            style={activeTab === 'buzz' ? tabActive : tabInactive}
          >
            ✍️ バズる投稿生成
          </button>
        </div>

        {/* ============================================================ */}
        {/* タブ①：note記事生成（既存機能・変更なし） */}
        {/* ============================================================ */}
        {activeTab === 'note' && (
          <>
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
          </>
        )}

        {/* ============================================================ */}
        {/* タブ②：バズる投稿生成（独立ツール・変更なし） */}
        {/* ============================================================ */}
        {activeTab === 'buzz' && (
          <div ref={buzzRef}>
            <BuzzPostPanel
              profileCta={currentSettings.profileCta}
              postUrl={currentSettings.postUrl}
              onGenerate={handleBuzzGenerate}
              result={buzzResult}
              isLoading={isBuzzLoading}
            />
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
