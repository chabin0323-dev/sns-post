import React from 'react';

export const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: '#D4537E' }}>
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <span className="text-white text-lg">✏️</span>
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-none">SNS投稿ジェネレーター</h1>
            <p className="text-[10px] font-bold text-white/70 mt-0.5">全ジャンル対応・30秒でバズる投稿が完成</p>
          </div>
        </div>
      </div>
    </header>
  );
};
