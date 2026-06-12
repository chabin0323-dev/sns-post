// App.tsx
// バズる投稿生成タブのみ（note記事生成タブを削除）

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { BuzzPostPanel } from './components/BuzzPostPanel';
import { LoadingState } from './types';
import type { BuzzPostResult } from './types';
import { generateBuzzPost } from './services/buzzPostGenerator';

const BUZZ_RESULT_KEY = 'buzz_last_result_v1';

const App: React.FC = () => {
  const [buzzResult, setBuzzResult] = useState<BuzzPostResult | null>(null);
  const [isBuzzLoading, setIsBuzzLoading] = useState(false);
  const buzzRef = useRef<HTMLDivElement>(null);

  // 起動時に前回の生成結果を復元
  useEffect(() => {
    try {
      const savedBuzz = localStorage.getItem(BUZZ_RESULT_KEY);
      if (savedBuzz) {
        const parsedBuzz = JSON.parse(savedBuzz) as BuzzPostResult;
        if (parsedBuzz && parsedBuzz.postText) {
          setBuzzResult(parsedBuzz);
        }
      }
    } catch {
      // 復元失敗時は無視
    }
  }, []);

  const handleBuzzGenerate = async (
    articleText: string,
    length: 300 | 500 | 600,
    profileCta: string,
    postUrl: string,
    tiktokCta: string,
  ) => {
    setIsBuzzLoading(true);
    await new Promise(r => setTimeout(r, 400));
    try {
      const result = generateBuzzPost({
        articleText,
        tiktokLength: length,
        profileCta,
        postUrl,
        tiktokCta,
      });
      setBuzzResult(result);
      try {
        localStorage.setItem(BUZZ_RESULT_KEY, JSON.stringify(result));
      } catch { /* 保存失敗は無視 */ }
      setTimeout(() => {
        buzzRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('BuzzPost生成エラー:', err);
    } finally {
      setIsBuzzLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF0F5' }}>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* キャッチコピー */}
        <div className="text-center space-y-1 py-2">
          <h2 className="text-2xl font-black text-gray-800">記事を貼るだけで</h2>
          <p
            className="text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #F472B6, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            バズる投稿が全SNS即完成
          </p>
          <p className="text-xs text-gray-500 mt-1">APIキー不要・ローカル生成・完全無料</p>
        </div>

        {/* バッジ */}
        <div className="flex gap-3 justify-center flex-wrap">
          {[
            { icon: '🎬', text: 'TikTok対応' },
            { icon: '💬', text: 'Threads対応' },
            { icon: '📝', text: 'note対応' },
            { icon: '⚡', text: '即時生成' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-pink-100">
              <span className="text-sm">{icon}</span>
              <span className="text-xs font-bold text-gray-600">{text}</span>
            </div>
          ))}
        </div>

        {/* バズる投稿生成 */}
        <div ref={buzzRef}>
          <BuzzPostPanel
            onGenerate={handleBuzzGenerate}
            result={buzzResult}
            isLoading={isBuzzLoading}
          />
        </div>

      </main>
      <footer className="text-center py-8 text-xs text-gray-400 select-none space-y-1">
        <p className="font-bold text-gray-500">SNS投稿ジェネレーター 2026</p>
        <p>APIキー不要 · 完全無料</p>
      </footer>
    </div>
  );
};

export default App;
