import React from 'react';

export const Header: React.FC = () => (
  <header
    className="sticky top-0 z-50 shadow-sm"
    style={{ background: 'linear-gradient(135deg, #FDF2F8, #FFF0F5)' }}
  >
    <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <div>
          <h1 className="text-base font-black text-gray-800 leading-tight">SNS投稿ジェネレーター</h1>
          <p className="text-xs text-pink-500 font-bold">2026年バズる投稿を即生成</p>
        </div>
      </div>
      <div
        className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #F472B6, #EC4899)' }}
      >
        APIキー不要
      </div>
    </div>
  </header>
);
