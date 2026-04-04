import React, { useMemo, useState } from 'react';
import { LoadingState } from '../types';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/solid';

interface InputFormProps {
  onGenerate: (
    theme: string,
    length: string,
    gender: string,
    age: string,
    templateText: string,
    templateUrl: string,
    tiktokTemplateText: string,
    insertPosition: 'start' | 'end',
    tiktokInsertPosition: 'start' | 'end' | 'both',
    autoCtaEnabled: boolean,
    scheduleTimes: string[],
    hashtagMode: 'あり' | 'なし'
  ) => void;
  onCancel: () => void;
  loadingState: LoadingState;
  progress: number;
}

const MAX_HISTORY = 10;
const ITEMS_PER_PAGE = 5;

const LOCAL_KEYWORD_MAP: Record<string, string[]> = {
  恋愛: ['片想い', '復縁', '告白', '脈あり', '本音', '恋愛心理', '忘れられない人', '距離感', '好き避け', '連絡頻度'],
  美容: ['スキンケア', '毛穴', '乾燥対策', 'エイジングケア', '垢抜け', 'メイク時短', '美容習慣', '小顔', 'UV対策', '美肌'],
  ダイエット: ['食事改善', '痩せ習慣', 'リバウンド', '代謝アップ', 'ながら運動', '脂肪燃焼', '腸活', 'むくみ改善', '間食対策', '朝活'],
  副業: ['在宅ワーク', 'SNS集客', '初心者副業', '収益化', 'コンテンツ販売', '時短副業', 'AI活用', 'スキル販売', '継続力', '仕組み化'],
  SNS: ['バズ投稿', '伸びる書き方', '保存される投稿', '投稿ネタ', 'フォロワー増加', 'リール戦略', '導線設計', 'プロフィール改善', '毎日投稿', '共感文章'],
  仕事: ['人間関係', '評価される人', '習慣改善', '時間管理', 'モチベーション', '会話術', '信頼構築', 'キャリア', '転職不安', '成長戦略'],
  健康: ['睡眠改善', '疲労回復', '自律神経', '腸内環境', '肩こり対策', 'ストレス解消', '朝習慣', '温活', '姿勢改善', '生活改善'],
};

const COMMON_KEYWORDS = [
  '初心者向け',
  '知らないと損',
  '今すぐできる',
  '習慣化',
  'やってはいけない',
  '続けるコツ',
  '選ばれる方法',
  '失敗しない考え方',
  'おすすめの始め方',
  '結果が変わるコツ',
  '伸びる型',
  '売れる導線',
  '共感される書き方',
  '保存したくなる内容',
  '行動したくなる一言'
];

const readHistory = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
  } catch {
    return [];
  }
};

const writeHistory = (key: string, values: string[]) => {
  localStorage.setItem(key, JSON.stringify(values.slice(0, MAX_HISTORY)));
};

const addHistory = (key: string, value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return readHistory(key);
  const current = readHistory(key);
  const next = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, MAX_HISTORY);
  writeHistory(key, next);
  return next;
};

const removeHistory = (key: string, value: string) => {
  const next = readHistory(key).filter((item) => item !== value);
  writeHistory(key, next);
  return next;
};

const getRelatedKeywordsLocal = (theme: string): string[] => {
  const trimmed = theme.trim();
  if (!trimmed) return [];

  const matchedEntry = Object.entries(LOCAL_KEYWORD_MAP).find(([key]) =>
    trimmed.includes(key)
  );

  const base = matchedEntry ? matchedEntry[1] : [];
  const merged = [
    ...base,
    `${trimmed} 初心者`,
    `${trimmed} コツ`,
    `${trimmed} やり方`,
    `${trimmed} テンプレ`,
    `${trimmed} 失敗`,
    `${trimmed} 改善`,
    `${trimmed} 投稿例`,
    ...COMMON_KEYWORDS
  ];

  return Array.from(new Set(merged)).slice(0, 15);
};

const SectionButton: React.FC<{
  title: string;
  subtitle: string;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}> = ({ title, subtitle, isOpen, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between rounded-2xl p-4 text-left border ${className}`}
  >
    <div>
      <div className="font-black text-slate-800">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
    {isOpen ? (
      <ChevronUpIcon className="w-5 h-5 text-slate-500" />
    ) : (
      <ChevronDownIcon className="w-5 h-5 text-slate-500" />
    )}
  </button>
);

const HistoryChips: React.FC<{
  title: string;
  items: string[];
  onSelect: (value: string) => void;
  onDelete: (value: string) => void;
}> = ({ title, items, onSelect, onDelete }) => {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-3">
      <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-wider">
        <ClockIcon className="w-3 h-3" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 max-w-full"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 break-all text-left"
            >
              {item}
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="shrink-0 text-slate-400 hover:text-red-500"
              aria-label={`${title}を削除`}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({
  onGenerate,
  onCancel,
  loadingState,
  progress
}) => {
  const isLoading = loadingState === LoadingState.LOADING;

  const [theme, setTheme] = useState('');
  const [gender, setGender] = useState('男性');
  const [age, setAge] = useState('30代');
  const [length, setLength] = useState('300文字');

  const [templateText, setTemplateText] = useState('詳しくはこちら👇');
  const [templateUrl, setTemplateUrl] = useState('');
  const [tiktokTemplateText, setTiktokTemplateText] = useState('続きはプロフィールから👇');

  const [insertPosition, setInsertPosition] = useState<'start' | 'end'>('end');
  const [tiktokInsertPosition, setTiktokInsertPosition] = useState<'start' | 'end' | 'both'>('start');
  const [hashtagMode, setHashtagMode] = useState<'あり' | 'なし'>('あり');

  const [scheduleMorning, setScheduleMorning] = useState('08:00');
  const [scheduleNoon, setScheduleNoon] = useState('12:00');
  const [scheduleNight, setScheduleNight] = useState('20:00');
  const [autoCtaEnabled, setAutoCtaEnabled] = useState(true);

  const [openBasic, setOpenBasic] = useState(false);
  const [openCommon, setOpenCommon] = useState(false);
  const [openTiktok, setOpenTiktok] = useState(false);
  const [openAutomation, setOpenAutomation] = useState(true);
  const [showThemeHistory, setShowThemeHistory] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const HISTORY_KEYS = useMemo(
    () => ({
      theme: 'history_theme',
      gender: 'history_gender',
      age: 'history_age',
      length: 'history_length',
      templateText: 'history_template_text',
      templateUrl: 'history_template_url',
      tiktokTemplateText: 'history_tiktok_template_text',
      insertPosition: 'history_insert_position',
      tiktokInsertPosition: 'history_tiktok_insert_position',
      hashtagMode: 'history_hashtag_mode',
      scheduleMorning: 'history_schedule_morning',
      scheduleNoon: 'history_schedule_noon',
      scheduleNight: 'history_schedule_night',
    }),
    []
  );

  const [themeHistory, setThemeHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.theme));
  const [genderHistory, setGenderHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.gender));
  const [ageHistory, setAgeHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.age));
  const [lengthHistory, setLengthHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.length));
  const [templateTextHistory, setTemplateTextHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.templateText));
  const [templateUrlHistory, setTemplateUrlHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.templateUrl));
  const [tiktokTemplateTextHistory, setTiktokTemplateTextHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.tiktokTemplateText));
  const [insertPositionHistory, setInsertPositionHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.insertPosition));
  const [tiktokInsertPositionHistory, setTiktokInsertPositionHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.tiktokInsertPosition));
  const [hashtagModeHistory, setHashtagModeHistory] = useState<string[]>(() => readHistory(HISTORY_KEYS.hashtagMode));

  const saveAllHistories = () => {
    setThemeHistory(addHistory(HISTORY_KEYS.theme, theme));
    setGenderHistory(addHistory(HISTORY_KEYS.gender, gender));
    setAgeHistory(addHistory(HISTORY_KEYS.age, age));
    setLengthHistory(addHistory(HISTORY_KEYS.length, length));
    setTemplateTextHistory(addHistory(HISTORY_KEYS.templateText, templateText));
    setTemplateUrlHistory(addHistory(HISTORY_KEYS.templateUrl, templateUrl));
    setTiktokTemplateTextHistory(addHistory(HISTORY_KEYS.tiktokTemplateText, tiktokTemplateText));
    setInsertPositionHistory(addHistory(HISTORY_KEYS.insertPosition, insertPosition));
    setTiktokInsertPositionHistory(addHistory(HISTORY_KEYS.tiktokInsertPosition, tiktokInsertPosition));
    setHashtagModeHistory(addHistory(HISTORY_KEYS.hashtagMode, hashtagMode));
    addHistory(HISTORY_KEYS.scheduleMorning, scheduleMorning);
    addHistory(HISTORY_KEYS.scheduleNoon, scheduleNoon);
    addHistory(HISTORY_KEYS.scheduleNight, scheduleNight);
  };

  const handleSuggest = async () => {
    if (!theme.trim()) return;
    setIsSuggesting(true);
    setSuggestionPage(0);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const keywords = getRelatedKeywordsLocal(theme);
      setSuggestions(keywords);
      setShowThemeHistory(false);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setTheme(value);
    setSuggestions([]);
  };

  const nextSuggestionPage = () => {
    if ((suggestionPage + 1) * ITEMS_PER_PAGE < suggestions.length) {
      setSuggestionPage(suggestionPage + 1);
    } else {
      setSuggestionPage(0);
    }
  };

  const prevSuggestionPage = () => {
    if (suggestionPage > 0) {
      setSuggestionPage(suggestionPage - 1);
    } else {
      setSuggestionPage(Math.floor((suggestions.length - 1) / ITEMS_PER_PAGE));
    }
  };

  const currentSuggestions = suggestions.slice(
    suggestionPage * ITEMS_PER_PAGE,
    (suggestionPage + 1) * ITEMS_PER_PAGE
  );

  const scheduleTimes = [scheduleMorning, scheduleNoon, scheduleNight].filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    saveAllHistories();

    onGenerate(
      theme,
      length,
      gender,
      age,
      templateText,
      templateUrl,
      tiktokTemplateText,
      insertPosition,
      tiktokInsertPosition,
      autoCtaEnabled,
      scheduleTimes,
      hashtagMode
    );
  };

  return (
    <div className="w-full bg-white rounded-[40px] shadow-2xl p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black">SNS投稿を一瞬で作成</h2>
          <p className="text-sm text-gray-500">テーマを入れるだけで投稿完成</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 via-pink-50 to-cyan-50 p-6 rounded-3xl space-y-4 border border-indigo-100">
          <div className="flex items-center justify-between gap-3">
            <label className="font-bold text-slate-800">投稿テーマ</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSuggest}
                disabled={!theme.trim() || isSuggesting}
                className={`text-xs font-black ${theme.trim() ? 'text-indigo-600' : 'text-slate-300'}`}
              >
                {isSuggesting ? '...' : '提案'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowThemeHistory(!showThemeHistory);
                  setSuggestions([]);
                }}
                className="text-xs font-black text-indigo-600"
              >
                履歴
              </button>
            </div>
          </div>

          <div className="relative">
            <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例：復縁、不倫、片思い"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none border-indigo-200"
              disabled={isLoading}
            />
          </div>

          {showThemeHistory && (
            <HistoryChips
              title="テーマ履歴"
              items={themeHistory}
              onSelect={setTheme}
              onDelete={(value) => setThemeHistory(removeHistory(HISTORY_KEYS.theme, value))}
            />
          )}

          {suggestions.length > 0 && (
            <div className="rounded-2xl border border-indigo-100 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-wider">
                  <LightBulbIcon className="w-3 h-3" />
                  おすすめテーマ
                </div>
                <div className="flex items-center gap-3 text-xs font-black text-slate-500">
                  <button type="button" onClick={prevSuggestionPage}>戻る</button>
                  <span>|</span>
                  <button type="button" onClick={nextSuggestionPage}>次</button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-600"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <SectionButton
          title="自動化設定"
          subtitle="投稿時間・全部自動生成"
          isOpen={openAutomation}
          onClick={() => setOpenAutomation(!openAutomation)}
          className="bg-gradient-to-r from-pink-100 to-cyan-100 border-pink-200"
        />

        {openAutomation && (
          <div className="p-4 space-y-4 bg-white rounded-2xl border border-pink-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="time"
                value={scheduleMorning}
                onChange={(e) => setScheduleMorning(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
              <input
                type="time"
                value={scheduleNoon}
                onChange={(e) => setScheduleNoon(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
              <input
                type="time"
                value={scheduleNight}
                onChange={(e) => setScheduleNight(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={autoCtaEnabled}
                onChange={(e) => setAutoCtaEnabled(e.target.checked)}
              />
              <span className="font-bold text-slate-700">
                動画の最後に「続きはプロフィール / 無料占いはこちら」を自動挿入
              </span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button type="submit" className="rounded-2xl bg-fuchsia-500 text-white font-black py-3">
                台本生成
              </button>
              <button type="submit" className="rounded-2xl bg-cyan-500 text-white font-black py-3">
                動画生成
              </button>
              <button type="submit" className="rounded-2xl bg-emerald-500 text-white font-black py-3">
                投稿データ作成
              </button>
              <button type="submit" className="rounded-2xl bg-black text-white font-black py-3">
                全部自動生成
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <SectionButton
            title="投稿設定"
            subtitle="性別・年代・文字数・ハッシュタグ"
            isOpen={openBasic}
            onClick={() => setOpenBasic(!openBasic)}
            className="bg-gray-100 border-gray-200"
          />

          {openBasic && (
            <div className="p-4 space-y-4 bg-gray-50 rounded-2xl border border-gray-200">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option>男性</option>
                <option>女性</option>
                <option>指定なし</option>
              </select>
              <HistoryChips
                title="性別履歴"
                items={genderHistory}
                onSelect={setGender}
                onDelete={(value) => setGenderHistory(removeHistory(HISTORY_KEYS.gender, value))}
              />

              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option>20代</option>
                <option>30代</option>
                <option>40代</option>
                <option>50代以上</option>
                <option>指定なし</option>
              </select>
              <HistoryChips
                title="年代履歴"
                items={ageHistory}
                onSelect={setAge}
                onDelete={(value) => setAgeHistory(removeHistory(HISTORY_KEYS.age, value))}
              />

              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option>200文字</option>
                <option>300文字</option>
                <option>500文字</option>
              </select>
              <HistoryChips
                title="文字数履歴"
                items={lengthHistory}
                onSelect={setLength}
                onDelete={(value) => setLengthHistory(removeHistory(HISTORY_KEYS.length, value))}
              />

              <select
                value={hashtagMode}
                onChange={(e) => setHashtagMode(e.target.value as 'あり' | 'なし')}
                className="w-full p-3 rounded-xl border"
              >
                <option value="あり">ハッシュタグあり</option>
                <option value="なし">ハッシュタグなし</option>
              </select>
              <HistoryChips
                title="ハッシュタグ履歴"
                items={hashtagModeHistory}
                onSelect={(value) => setHashtagMode(value as 'あり' | 'なし')}
                onDelete={(value) => setHashtagModeHistory(removeHistory(HISTORY_KEYS.hashtagMode, value))}
              />
            </div>
          )}

          <SectionButton
            title="note・X設定"
            subtitle="決まり文・URL・挿入位置"
            isOpen={openCommon}
            onClick={() => setOpenCommon(!openCommon)}
            className="bg-indigo-100 border-indigo-200"
          />

          {openCommon && (
            <div className="p-4 space-y-4 bg-indigo-50 rounded-2xl border border-indigo-200">
              <input
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="w-full p-3 rounded-xl border"
                placeholder="詳しくはこちら👇"
              />
              <HistoryChips
                title="決まり文履歴"
                items={templateTextHistory}
                onSelect={setTemplateText}
                onDelete={(value) => setTemplateTextHistory(removeHistory(HISTORY_KEYS.templateText, value))}
              />

              <input
                value={templateUrl}
                onChange={(e) => setTemplateUrl(e.target.value)}
                placeholder="URL"
                className="w-full p-3 rounded-xl border"
              />
              <HistoryChips
                title="URL履歴"
                items={templateUrlHistory}
                onSelect={setTemplateUrl}
                onDelete={(value) => setTemplateUrlHistory(removeHistory(HISTORY_KEYS.templateUrl, value))}
              />

              <select
                value={insertPosition}
                onChange={(e) => setInsertPosition(e.target.value as 'start' | 'end')}
                className="w-full p-3 rounded-xl border"
              >
                <option value="start">最初</option>
                <option value="end">最後</option>
              </select>
              <HistoryChips
                title="挿入位置履歴"
                items={insertPositionHistory}
                onSelect={(value) => setInsertPosition(value as 'start' | 'end')}
                onDelete={(value) => setInsertPositionHistory(removeHistory(HISTORY_KEYS.insertPosition, value))}
              />
            </div>
          )}

          <SectionButton
            title="TikTok設定"
            subtitle="専用決まり文・挿入位置"
            isOpen={openTiktok}
            onClick={() => setOpenTiktok(!openTiktok)}
            className="bg-cyan-100 border-cyan-200"
          />

          {openTiktok && (
            <div className="p-4 space-y-4 bg-cyan-50 rounded-2xl border border-cyan-200">
              <input
                value={tiktokTemplateText}
                onChange={(e) => setTiktokTemplateText(e.target.value)}
                className="w-full p-3 rounded-xl border"
                placeholder="続きはプロフィールから👇"
              />
              <HistoryChips
                title="TikTok決まり文履歴"
                items={tiktokTemplateTextHistory}
                onSelect={setTiktokTemplateText}
                onDelete={(value) => setTiktokTemplateTextHistory(removeHistory(HISTORY_KEYS.tiktokTemplateText, value))}
              />

              <select
                value={tiktokInsertPosition}
                onChange={(e) =>
                  setTiktokInsertPosition(e.target.value as 'start' | 'end' | 'both')
                }
                className="w-full p-3 rounded-xl border"
              >
                <option value="start">最初（おすすめ）</option>
                <option value="end">最後</option>
                <option value="both">最初＋最後</option>
              </select>
              <HistoryChips
                title="TikTok挿入位置履歴"
                items={tiktokInsertPositionHistory}
                onSelect={(value) => setTiktokInsertPosition(value as 'start' | 'end' | 'both')}
                onDelete={(value) =>
                  setTiktokInsertPositionHistory(removeHistory(HISTORY_KEYS.tiktokInsertPosition, value))
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!isLoading ? (
            <button
              type="submit"
              disabled={!theme.trim()}
              className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-bold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              生成する
              <PaperAirplaneIcon className="w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative flex-grow bg-slate-100 rounded-3xl p-1 h-[72px] overflow-hidden flex items-center border border-slate-200 shadow-inner">
                <div
                  className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl transition-all duration-300 ease-out"
                  style={{ width: `calc(${progress}% - 8px)`, minWidth: '1%' }}
                />
                <div className="relative w-full flex items-center justify-center gap-3 font-black italic">
                  <span className="text-2xl text-white drop-shadow-md tracking-tighter">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCancel}
                className="w-[72px] h-[72px] bg-red-500 text-white rounded-3xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-95"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
