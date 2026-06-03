import React, { useState } from 'react';
import type { Genre, Theme, HookType, OutputKey } from '../types';
import { LoadingState } from '../types';
import { GENRE_THEMES } from '../services/contentGenerator';

const GENRES: Genre[] = [
  '恋愛', 'お金・資産', '副業・稼ぐ', '美容・ダイエット', '育児・子育て',
  '健康・メンタル', '転職・キャリア', '人間関係', 'ビジネス・起業', 'ライフスタイル',
];

const GENRE_ICONS: Record<Genre, string> = {
  '恋愛': '💕', 'お金・資産': '💰', '副業・稼ぐ': '🔥', '美容・ダイエット': '✨',
  '育児・子育て': '👶', '健康・メンタル': '🌿', '転職・キャリア': '💼',
  '人間関係': '🤝', 'ビジネス・起業': '🚀', 'ライフスタイル': '🌸',
};

const HOOK_TYPES: HookType[] = ['否定系', '不安系', '暴露系', '共感系', '実は系', '数字系', '限定系'];

const HOOK_DESCRIPTIONS: Record<HookType, string> = {
  '否定系': '常識を否定して注目を集める',
  '不安系': '読者の不安を刺激して引き込む',
  '暴露系': '秘密・裏側を明かして好奇心を刺激',
  '共感系': '読者の気持ちに寄り添う',
  '実は系': '意外な事実を提示して驚かせる',
  '数字系': '具体的な数字で信頼性を高める',
  '限定系': '特別感・希少性で行動を促す',
};

const OUTPUT_OPTIONS: { key: OutputKey; label: string; emoji: string }[] = [
  { key: 'mainContent', label: 'TikTok台本', emoji: '🎬' },
  { key: 'hashtags', label: 'ハッシュタグ', emoji: '#️⃣' },
  { key: 'threads', label: 'Threads投稿', emoji: '🧵' },
  { key: 'x', label: 'X(Twitter)', emoji: '𝕏' },
  { key: 'note', label: 'note記事', emoji: '📝' },
  { key: 'seo', label: 'SEO対策', emoji: '🔍' },
  { key: 'thumbnail', label: 'サムネイル案', emoji: '🖼️' },
];

const PROFILE_CTAS = [
  'プロフィールに詳しいリンクあります✨',
  '続きはプロフィールのnoteで公開中📝',
  '無料相談はプロフィールのLINEから💌',
  '詳細はプロフィールから確認してね👇',
  '保存して後で使ってね📌',
];

interface Props {
  onGenerate: (params: {
    genre: Genre;
    theme: Theme;
    hookType: HookType;
    prevTitle: string;
    enabledKeys: OutputKey[];
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
  }) => void;
  loadingState: LoadingState;
}

export const InputForm: React.FC<Props> = ({ onGenerate, loadingState }) => {
  const [genre, setGenre] = useState<Genre>('恋愛');
  const [theme, setTheme] = useState<Theme>('脈なし');
  const [hookType, setHookType] = useState<HookType>('否定系');
  const [prevTitle, setPrevTitle] = useState('');
  const [tiktokLength, setTiktokLength] = useState<300 | 500 | 600>(500);
  const [profileCta, setProfileCta] = useState(PROFILE_CTAS[0]);
  const [postUrl, setPostUrl] = useState('');
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>(['mainContent', 'hashtags', 'threads', 'x']);

  const themes = GENRE_THEMES[genre];

  const handleGenreChange = (g: Genre) => {
    setGenre(g);
    setTheme(GENRE_THEMES[g][0]);
  };

  const toggleKey = (key: OutputKey) => {
    setEnabledKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (enabledKeys.length === 0) return;
    onGenerate({ genre, theme, hookType, prevTitle, enabledKeys, tiktokLength, profileCta, postUrl });
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="space-y-5">

      {/* ジャンル選択 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          📂 ジャンルを選択
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                genre === g
                  ? 'text-white shadow-md scale-[1.02]'
                  : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
              }`}
              style={genre === g ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}
            >
              <span className="text-base">{GENRE_ICONS[g]}</span>
              <span>{g}</span>
            </button>
          ))}
        </div>
      </div>

      {/* テーマ選択 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          🎯 テーマを選択
        </label>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                theme === t
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50'
              }`}
              style={theme === t ? { background: 'linear-gradient(135deg, #FB7185, #F43F5E)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* フックタイプ */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          🎣 フックタイプ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {HOOK_TYPES.map(h => (
            <button
              key={h}
              onClick={() => setHookType(h)}
              className={`px-3 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                hookType === h
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50'
              }`}
              style={hookType === h ? { background: 'linear-gradient(135deg, #A855F7, #7C3AED)' } : {}}
            >
              <div>{h}</div>
              <div className={`text-xs mt-0.5 font-normal ${hookType === h ? 'text-purple-100' : 'text-gray-400'}`}>
                {HOOK_DESCRIPTIONS[h]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 文字数 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          📏 文字数
        </label>
        <div className="flex gap-3">
          {([300, 500, 600] as const).map(len => (
            <button
              key={len}
              onClick={() => setTiktokLength(len)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                tiktokLength === len
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50'
              }`}
              style={tiktokLength === len ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}
            >
              {len}文字
            </button>
          ))}
        </div>
      </div>

      {/* 出力項目 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          📦 出力する項目を選択
        </label>
        <div className="grid grid-cols-2 gap-2">
          {OUTPUT_OPTIONS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => toggleKey(key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                enabledKeys.includes(key)
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-500 hover:bg-pink-50'
              }`}
              style={enabledKeys.includes(key) ? { background: 'linear-gradient(135deg, #34D399, #10B981)' } : {}}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {enabledKeys.includes(key) && <span className="ml-auto text-white">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* プロフィール誘導文 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          👤 プロフィール誘導文
        </label>
        <div className="space-y-2">
          {PROFILE_CTAS.map(cta => (
            <button
              key={cta}
              onClick={() => setProfileCta(cta)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                profileCta === cta
                  ? 'text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50'
              }`}
              style={profileCta === cta ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}
            >
              {cta}
            </button>
          ))}
          <input
            type="text"
            placeholder="カスタム入力..."
            value={PROFILE_CTAS.includes(profileCta) ? '' : profileCta}
            onChange={e => setProfileCta(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      {/* 前回タイトル・投稿URL */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            🔗 投稿URL（Threads/X等）
          </label>
          <input
            type="text"
            placeholder="https://threads.net/..."
            value={postUrl}
            onChange={e => setPostUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            📌 前回の投稿タイトル（任意）
          </label>
          <input
            type="text"
            placeholder="前回の人気投稿を参考に生成..."
            value={prevTitle}
            onChange={e => setPrevTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      {/* 生成ボタン */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || enabledKeys.length === 0}
        className="w-full py-4 rounded-2xl text-white text-base font-black tracking-wide transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isLoading
            ? '#ccc'
            : 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)',
          boxShadow: isLoading ? 'none' : '0 4px 20px rgba(236, 72, 153, 0.4)',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⟳</span> 生成中...
          </span>
        ) : (
          '🔥 2026年バズる投稿を生成する'
        )}
      </button>
    </div>
  );
};
