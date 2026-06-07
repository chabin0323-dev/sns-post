import React, { useState, useEffect, useCallback } from 'react';
import type { Genre, Theme, OutputKey } from '../types';
import { LoadingState } from '../types';
import { GENRE_THEMES } from '../services/loveContentGenerator';

const GENRES: Genre[] = [
  '恋愛', 'お金・資産', '副業・稼ぐ', '美容・ダイエット', '育児・子育て',
  '健康・メンタル', '転職・キャリア', '人間関係', 'ビジネス・起業', 'ライフスタイル',
];

const GENRE_ICONS: Record<Genre, string> = {
  '恋愛': '💕', 'お金・資産': '💰', '副業・稼ぐ': '🔥', '美容・ダイエット': '✨',
  '育児・子育て': '👶', '健康・メンタル': '🌿', '転職・キャリア': '💼',
  '人間関係': '🤝', 'ビジネス・起業': '🚀', 'ライフスタイル': '🌸',
};

const OUTPUT_OPTIONS: { key: OutputKey; label: string; emoji: string }[] = [
  { key: 'mainContent', label: 'TikTok台本', emoji: '🎬' },
  { key: 'hashtags', label: 'ハッシュタグ', emoji: '#️⃣' },
  { key: 'threads', label: 'Threads投稿', emoji: '🧵' },
  { key: 'x', label: 'X(Twitter)', emoji: '𝕏' },
  { key: 'note', label: 'note記事', emoji: '📝' },
  { key: 'seo', label: 'SEO対策', emoji: '🔍' },
  { key: 'thumbnailTikTok', label: 'TikTokサムネイル', emoji: '📱' },
  { key: 'thumbnailNote', label: 'noteサムネイル', emoji: '🖼️' },
];

const PROFILE_CTAS = [
  'プロフィールに詳しいリンクあります✨',
  '続きはプロフィールのnoteで公開中📝',
  '無料相談はプロフィールのLINEから💌',
  '詳細はプロフィールから確認してね👇',
  '保存して後で使ってね📌',
];

// ── 永続保存ヘルパー（localStorage のみ・コンポーネント外） ──
const _STORAGE_KEY = 'sns_post_saved_v2';
const _loadStorage = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, string> : {};
  } catch(e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    alert('⚠️読込エラー: ' + msg);
    return {};
  }
};
const _writeStorage = (data: Record<string, string>): void => {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(_STORAGE_KEY, json);
    // 書き込み直後に読み返して確認
    const verify = localStorage.getItem(_STORAGE_KEY);
    if (verify !== json) {
      alert('⚠️保存失敗: 書き込み後の読み返し不一致');
    }
  } catch(e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    alert('⚠️保存エラー: ' + msg);
  }
};

interface Props {
  onGenerate: (params: {
    genre: Genre;
    theme: Theme;
    prevTitle: string;
    enabledKeys: OutputKey[];
    tiktokLength: 300 | 500 | 600;
    profileCta: string;
    postUrl: string;
    freeTheme?: string;
  }) => void;
  loadingState: LoadingState;
}

// ── SaveButton をコンポーネント外のトップレベルで定義 ──
interface SaveButtonProps {
  field: string;
  value: string;
  savedField: string | null;
  onSave: (field: string, value: string) => void;
}
const SaveButton: React.FC<SaveButtonProps> = ({ field, value, savedField, onSave }) => (
  <button
    type="button"
    onClick={() => onSave(field, value)}
    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
    style={{
      background: savedField === field
        ? 'linear-gradient(135deg, #34D399, #10B981)'
        : 'linear-gradient(135deg, #F472B6, #EC4899)',
      color: 'white',
    }}
  >
    {savedField === field ? '✓ 保存済' : '保存'}
  </button>
);

export const InputForm: React.FC<Props> = ({ onGenerate, loadingState }) => {
  const [genre, setGenre] = useState<Genre>('恋愛');
  const [theme, setTheme] = useState<Theme>('脈なし');
  const [prevTitle, setPrevTitle] = useState('');
  const [tiktokLength, setTiktokLength] = useState<300 | 500 | 600>(500);
  const [profileCta, setProfileCta] = useState(PROFILE_CTAS[0]);
  const [postUrl, setPostUrl] = useState('');
  const [enabledKeys, setEnabledKeys] = useState<OutputKey[]>(['mainContent', 'hashtags', 'threads', 'x']);
  const [freeTheme, setFreeTheme] = useState('');
  const [savedField, setSavedField] = useState<string | null>(null);

  // アプリ起動時に保存データを復元
  useEffect(() => {
    const raw = localStorage.getItem('sns_post_saved_v2');
    alert('起動時localStorage取得: ' + (raw ? raw.slice(0, 80) : 'null（データなし）'));
    const data = _loadStorage();
    if (data.prevTitle) setPrevTitle(data.prevTitle);
    if (data.postUrl) setPostUrl(data.postUrl);
    if (data.freeTheme) setFreeTheme(data.freeTheme);
    if (data.profileCta) setProfileCta(data.profileCta);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showSaved = useCallback((field: string) => {
    setSavedField(field);
    setTimeout(() => setSavedField(null), 1500);
  }, []);

  // 保存処理：useCallbackで安定した参照を保持
  const saveField = useCallback((field: string, value: string) => {
    const data = _loadStorage();
    data[field] = value;
    _writeStorage(data);
    showSaved(field);
  }, [showSaved]);

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
    onGenerate({ genre, theme, prevTitle, enabledKeys, tiktokLength, profileCta, postUrl, freeTheme });
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">📂 ジャンルを選択</label>
        <div className="grid grid-cols-2 gap-2">
          {GENRES.map(g => (
            <button key={g} onClick={() => handleGenreChange(g)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${genre === g ? 'text-white shadow-md scale-[1.02]' : 'bg-pink-50 text-gray-600 hover:bg-pink-100'}`}
              style={genre === g ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}>
              <span className="text-base">{GENRE_ICONS[g]}</span><span>{g}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">🎯 テーマを選択</label>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${theme === t ? 'text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-pink-50'}`}
              style={theme === t ? { background: 'linear-gradient(135deg, #FB7185, #F43F5E)' } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ① テーマ自由入力欄 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-2">✏️ テーマを自由入力（任意）</label>
        <p className="text-xs text-gray-400 mb-3">例：恋愛・復縁・結婚・転職・人間関係・金運など</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="自由にテーマを入力..."
            value={freeTheme}
            onChange={e => setFreeTheme(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <SaveButton field="freeTheme" value={freeTheme} savedField={savedField} onSave={saveField} />
        </div>
      </div>

      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #FDF4FF, #FAE8FF)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}>✨</div>
        <div>
          <p className="text-sm font-black text-purple-800">フックタイプ：AIバズお任せ自動選択</p>
          <p className="text-xs text-purple-500 mt-0.5">ジャンル×テーマから最もバズるフックを自動で選びます</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">📏 文字数</label>
        <div className="flex gap-3">
          {([300, 500, 600] as const).map(len => (
            <button key={len} onClick={() => setTiktokLength(len)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tiktokLength === len ? 'text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-pink-50'}`}
              style={tiktokLength === len ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}>
              {len}文字
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">📦 出力する項目を選択</label>
        <div className="grid grid-cols-2 gap-2">
          {OUTPUT_OPTIONS.map(({ key, label, emoji }) => (
            <button key={key} onClick={() => toggleKey(key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${enabledKeys.includes(key) ? 'text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-pink-50'}`}
              style={enabledKeys.includes(key) ? { background: 'linear-gradient(135deg, #34D399, #10B981)' } : {}}>
              <span>{emoji}</span><span>{label}</span>
              {enabledKeys.includes(key) && <span className="ml-auto text-white">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
        <label className="block text-sm font-bold text-gray-700 mb-3">👤 プロフィール誘導文</label>
        <div className="space-y-2">
          {PROFILE_CTAS.map(cta => (
            <button key={cta} onClick={() => setProfileCta(cta)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${profileCta === cta ? 'text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-pink-50'}`}
              style={profileCta === cta ? { background: 'linear-gradient(135deg, #F472B6, #EC4899)' } : {}}>
              {cta}
            </button>
          ))}
          <div className="flex gap-2">
            <input type="text" placeholder="カスタム入力..."
              value={PROFILE_CTAS.includes(profileCta) ? '' : profileCta}
              onChange={e => setProfileCta(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            <SaveButton field="profileCta" value={profileCta} savedField={savedField} onSave={saveField} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">🔗 投稿URL（Threads/X等）</label>
          <div className="flex gap-2">
            <input type="text" placeholder="https://threads.net/..." value={postUrl}
              onChange={e => setPostUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            <SaveButton field="postUrl" value={postUrl} savedField={savedField} onSave={saveField} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">📌 前回の投稿タイトル（任意）</label>
          <div className="flex gap-2">
            <input type="text" placeholder="前回の人気投稿を参考に生成..." value={prevTitle}
              onChange={e => setPrevTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            <SaveButton field="prevTitle" value={prevTitle} savedField={savedField} onSave={saveField} />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={isLoading || enabledKeys.length === 0}
        className="w-full py-4 rounded-2xl text-white text-base font-black tracking-wide transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: isLoading ? '#ccc' : 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)', boxShadow: isLoading ? 'none' : '0 4px 20px rgba(236, 72, 153, 0.4)' }}>
        {isLoading
          ? <span className="flex items-center justify-center gap-2"><span className="animate-spin">⟳</span> 生成中...</span>
          : '🔥 2026年バズる投稿を生成する'}
      </button>
    </div>
  );
};
