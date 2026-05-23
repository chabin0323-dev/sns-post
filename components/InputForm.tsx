import React, { useState } from 'react';
import { LoadingState } from '../types';
import type { Theme, HookType, OutputKey } from '../types';
import {
  ALL_THEMES,
  ALL_HOOK_TYPES,
  ALL_OUTPUT_KEYS,
  OUTPUT_KEY_LABELS,
  DEFAULT_ENABLED_KEYS,
} from '../services/loveContentGenerator';

const PROFILE_CTA_OPTIONS = [
  '気になる人との相性はプロフィールへ👇',
  '無料で相性診断できます！プロフィールへ👇',
  'あなたの運命の人、プロフィールで診断中👇',
  '相性占い無料でできます！詳しくはプロフへ👇',
  '気になる彼との相性、プロフィールで今すぐチェック👇',
];

const TIKTOK_LENGTHS: (300 | 500 | 600)[] = [300, 500, 600];

interface InputFormProps {
  onGenerate: (params: {
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

const ACTIVE_TAG = 'bg-[#FFE0EC] border-[#D4537E] text-[#72243E]';
const INACTIVE_TAG = 'bg-white border-gray-200 text-gray-600 hover:border-[#D4537E] hover:text-[#D4537E]';

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, loadingState }) => {
  const isLoading = loadingState === LoadingState.LOADING;

  const [prevTitle, setPrevTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedHook, setSelectedHook] = useState<HookType | null>(null);
  const [enabledKeys, setEnabledKeys] = useState<Set<OutputKey>>(new Set(DEFAULT_ENABLED_KEYS));
  const [tiktokLength, setTiktokLength] = useState<300 | 500 | 600>(500);
  const [profileCta, setProfileCta] = useState(PROFILE_CTA_OPTIONS[0]);
  const [postUrl, setPostUrl] = useState('https://nexa-lovelab.com/compatibility-free');

  const toggleKey = (key: OutputKey) => {
    setEnabledKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (key === 'mainContent') return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const canGenerate = selectedTheme !== null && selectedHook !== null && !isLoading;

  const handleSubmit = () => {
    if (!canGenerate || !selectedTheme || !selectedHook) return;
    onGenerate({
      theme: selectedTheme,
      hookType: selectedHook,
      prevTitle,
      enabledKeys: Array.from(enabledKeys),
      tiktokLength,
      profileCta,
      postUrl,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">

      {/* 前回タイトル */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          前回のタイトル
          <span className="ml-2 text-xs font-normal text-gray-400">（入力すると前回と違うバリエーションで生成）</span>
        </label>
        <input
          type="text"
          value={prevTitle}
          onChange={e => setPrevTitle(e.target.value)}
          placeholder="例：【脈なし】返信が遅くなったのは〇〇が原因でした"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#D4537E] transition-colors"
          disabled={isLoading}
        />
      </div>

      {/* テーマ選択 */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">
          テーマ選択
          <span className="ml-2 text-xs font-normal text-[#D4537E]">
            {selectedTheme ? `「${selectedTheme}」選択中` : '未選択'}
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map(theme => (
            <button
              key={theme}
              type="button"
              onClick={() => setSelectedTheme(theme === selectedTheme ? null : theme)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all active:scale-95 disabled:opacity-50 ${
                selectedTheme === theme ? ACTIVE_TAG : INACTIVE_TAG
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* フックタイプ選択 */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">
          フックタイプ
          <span className="ml-2 text-xs font-normal text-[#D4537E]">
            {selectedHook ? `「${selectedHook}」選択中` : '未選択'}
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_HOOK_TYPES.map(hook => (
            <button
              key={hook}
              type="button"
              onClick={() => setSelectedHook(hook === selectedHook ? null : hook)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 disabled:opacity-50 ${
                selectedHook === hook ? ACTIVE_TAG : INACTIVE_TAG
              }`}
            >
              {hook}
            </button>
          ))}
        </div>
      </div>

      {/* 出力タグ選択 */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">出力する項目</label>
        <div className="flex flex-wrap gap-2">
          {ALL_OUTPUT_KEYS.map(key => {
            const isOn = enabledKeys.has(key);
            const isRequired = key === 'mainContent';
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleKey(key)}
                disabled={isLoading || isRequired}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 disabled:cursor-default ${
                  isOn ? ACTIVE_TAG : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {isOn ? '✓' : '+'} {OUTPUT_KEY_LABELS[key]}
                {isRequired && <span className="ml-1 text-[10px]">必須</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 台本文字数選択 */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">
          台本の文字数
          <span className="ml-2 text-xs font-normal text-[#D4537E]">{tiktokLength}文字</span>
        </label>
        <div className="flex gap-2">
          {TIKTOK_LENGTHS.map(len => (
            <button
              key={len}
              type="button"
              onClick={() => setTiktokLength(len)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 disabled:opacity-50 ${
                tiktokLength === len ? ACTIVE_TAG : INACTIVE_TAG
              }`}
            >
              {len}文字
            </button>
          ))}
        </div>
      </div>

      {/* プロフィール誘導文選択 */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700">プロフィール誘導文</label>
        <div className="flex flex-wrap gap-2">
          {PROFILE_CTA_OPTIONS.map(cta => (
            <button
              key={cta}
              type="button"
              onClick={() => setProfileCta(cta)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 disabled:opacity-50 ${
                profileCta === cta ? ACTIVE_TAG : INACTIVE_TAG
              }`}
            >
              {cta}
            </button>
          ))}
        </div>
      </div>

      {/* Threads・X URL */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          Threads・X 投稿URL
          <span className="ml-2 text-xs font-normal text-gray-400">（投稿文末尾に自動追加）</span>
        </label>
        <input
          type="text"
          value={postUrl}
          onChange={e => setPostUrl(e.target.value)}
          placeholder="https://nexa-lovelab.com/compatibility-free"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#D4537E] transition-colors"
          disabled={isLoading}
        />
      </div>

      {/* 生成ボタン */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canGenerate}
        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-40"
        style={{ backgroundColor: canGenerate ? '#D4537E' : '#e9b4c7' }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            生成中...
          </span>
        ) : (
          '💕 コンテンツを生成する'
        )}
      </button>

      {!selectedTheme && (
        <p className="text-center text-xs text-gray-400">テーマとフックタイプを選択してください</p>
      )}
      {selectedTheme && !selectedHook && (
        <p className="text-center text-xs text-gray-400">フックタイプを選択してください</p>
      )}
    </div>
  );
};
