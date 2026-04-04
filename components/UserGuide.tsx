
import React from 'react';
import { SparklesIcon, AdjustmentsHorizontalIcon, DocumentDuplicateIcon, VideoCameraIcon, XMarkIcon, ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface UserGuideProps {
  onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-8 border border-slate-700 animate-fade-in relative">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20 flex items-center justify-center"
        title="ガイドを閉じる"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-yellow-400" />
        使い方ガイド
      </h3>

      <div className="grid gap-10">
        {/* Step 1 */}
        <section className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
            1
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white">テーマを入力する</h4>
            <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside font-medium">
              <li>「週末の旅行」「今日のランチ」「仕事の悩み」など自由に入力！</li>
              <li>単語を入力して「提案」ボタンを押すと、AIが関連キーワードを提案します。</li>
              <li>過去に入力した内容は「履歴」から簡単に呼び出せます。</li>
            </ul>
          </div>
        </section>

        {/* Step 2 */}
        <section className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-500/20">
            2
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white">詳細を設定する</h4>
            <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside font-medium">
              <li><span className="text-slate-200">文字数：</span>100文字から500文字まで用途に合わせて選択可能。</li>
              <li><span className="text-slate-200">プロフィール：</span>筆者の性別や年代を設定すると、文体が最適化されます。</li>
            </ul>
          </div>
        </section>

        {/* Step 3 */}
        <section className="flex gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">
            3
          </div>
          <div className="space-y-3 flex-grow">
            <h4 className="text-lg font-bold text-white">生成とコピー</h4>
            <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside font-medium">
              <li>「生成する」ボタンを押すと、AIが本文と動画用台本を作成します。</li>
              <li><span className="text-slate-200">記事：</span>コピーしてSNSにそのまま投稿可能！</li>
              <li><span className="text-slate-200">台本：</span>CapCutなどの読み上げに最適化されています。</li>
            </ul>
          </div>
        </section>

        {/* Safety & Limits Info */}
        <section className="flex gap-6 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheckIcon className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-black text-indigo-200 uppercase tracking-wider">安心・安全への取り組み</h4>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              入力データはサーバーに保存されず、ブラウザ内のみで管理されるため安全です。
            </p>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              安定したサービス提供と回答の質を維持するため、1日の利用上限を「合計5回まで」としております。0時にリセットされます。
            </p>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-xs font-bold leading-relaxed">
          さあ、まずはテーマを入力して<br />
          あなただけの特別な投稿を作成しましょう！
        </p>
      </div>
    </div>
  );
};
