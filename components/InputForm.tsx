import React, { useState, useEffect, useRef } from 'react';
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

export type GenerateMode = 'script' | 'video' | 'post_data' | 'full_auto';


const SETTINGS_KEY = 'sns_form_settings_v1';

type FormSettings = {
  theme: string;
  gender: string;
  age: string;
  length: string;
  templateText: string;
  templateUrl: string;
  tiktokTemplateText: string;
  insertPosition: 'start' | 'end';
  tiktokInsertPosition: 'start' | 'end' | 'both';
  hashtagMode: 'あり' | 'なし';
  scheduleMorning: string;
  scheduleNoon: string;
  scheduleNight: string;
  xPhrase: string;
  xUrl: string;
  threadsPhrase: string;
  threadsUrl: string;
  igYtPhrase: string;
  xLength: string;
  threadsLength: string;
};

const IG_YT_PHRASE_PRESETS = [
  '詳細はプロフィールのリンクから🔗',
  'プロフィールのリンクをチェック✨',
  '👆プロフィールから無料で試せます',
  '気になる方はプロフィールへ💫',
];

const defaultSettings: FormSettings = {
  theme: '',
  gender: '女性',
  age: '30代',
  length: '300文字',
  templateText: '詳しくはこちら👇',
  templateUrl: 'https://lovelab-sns-redirect.vercel.app',
  tiktokTemplateText: '',
  insertPosition: 'end',
  tiktokInsertPosition: 'start',
  hashtagMode: 'あり',
  scheduleMorning: '08:00',
  scheduleNoon: '12:00',
  scheduleNight: '20:00',
  xPhrase: '▼無料で試す',
  xUrl: 'https://lovelab-sns-redirect.vercel.app',
  threadsPhrase: '▼無料で試す',
  threadsUrl: 'https://lovelab-sns-redirect.vercel.app',
  igYtPhrase: '詳細はプロフィールのリンクから🔗',
  xLength: '140文字全角',
  threadsLength: '500文字',
};

const HISTORY_KEYS_CONST = {
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
} as const;

// ── ストレージ層1: Cookie（ITP対策・365日保持）──────────────────────────────
const COOKIE_KEY = 'snss1';
const COOKIE_EXPIRES_DAYS = 365;

const saveToCookie = (settings: Partial<FormSettings>) => {
  try {
    const val = encodeURIComponent(JSON.stringify(settings));
    const exp = new Date(Date.now() + COOKIE_EXPIRES_DAYS * 864e5).toUTCString();
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${COOKIE_KEY}=${val};expires=${exp};path=/;SameSite=Lax${secure}`;
  } catch {}
};

const loadFromCookie = (): Partial<FormSettings> | null => {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]+)`));
    return m ? JSON.parse(decodeURIComponent(m[1])) : null;
  } catch {}
  return null;
};

// ── 起動時設定読み込み（localStorage → Cookie → デフォルト）──────────────────
const loadSettings = (): FormSettings => {
  // 1. localStorage（最速・最優先）
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  // 2. Cookie（ITPでlocalStorageが消えた場合のフォールバック）
  try {
    const cookie = loadFromCookie();
    if (cookie) {
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...defaultSettings, ...cookie })); } catch {}
      return { ...defaultSettings, ...cookie };
    }
  } catch {}
  return defaultSettings;
};

// モジュールロード時に1回だけ読み込む（lazy initializer重複呼び出し防止）
const _initSettings = loadSettings();


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
    hashtagMode: 'あり' | 'なし',
    mode: GenerateMode,
    xPhrase: string,
    xUrl: string,
    threadsPhrase: string,
    threadsUrl: string,
    igYtPhrase: string,
    xLength: string,
    threadsLength: string
  ) => void;
  onCancel: () => void;
  loadingState: LoadingState;
  progress: number;
  relatedThemes?: string[];
}

const MAX_HISTORY = 10;
const ITEMS_PER_PAGE = 5;

const LOCAL_KEYWORD_MAP: Record<string, string[]> = {
  占い: ['片思い', '復縁', '運命の人', '相性', '好き避け', '連絡待ち', '不倫', '縁切り', '恋愛運', '告白タイミング', '彼の本音', '忘れられない人', '遠距離恋愛', '元カレ', '運命鑑定'],
  恋愛: ['片想い', '復縁', '告白', '脈あり', '本音', '恋愛心理', '忘れられない人', '距離感', '好き避け', '連絡頻度'],
  美容: ['スキンケア', '毛穴', '乾燥対策', 'エイジングケア', '垢抜け', 'メイク時短', '美容習慣', '小顔', 'UV対策', '美肌'],
  ダイエット: ['食事改善', '痩せ習慣', 'リバウンド', '代謝アップ', 'ながら運動', '脂肪燃焼', '腸活', 'むくみ改善', '間食対策', '朝活'],
  副業: ['在宅ワーク', 'SNS集客', '初心者副業', '収益化', 'コンテンツ販売', '時短副業', 'AI活用', 'スキル販売', '継続力', '仕組み化'],
  SNS: ['バズ投稿', '伸びる書き方', '保存される投稿', '投稿ネタ', 'フォロワー増加', 'リール戦略', '導線設計', 'プロフィール改善', '毎日投稿', '共感文章'],
  仕事: ['人間関係', '評価される人', '習慣改善', '時間管理', 'モチベーション', '会話術', '信頼構築', 'キャリア', '転職不安', '成長戦略'],
  健康: ['睡眠改善', '疲労回復', '自律神経', '腸内環境', '肩こり対策', 'ストレス解消', '朝習慣', '温活', '姿勢改善', '生活改善'],
};

const FORTUNE_PRESET = {
  gender: '女性',
  age: '30代',
  length: '300文字',
  templateText: '詳しくはこちら👇',
  templateUrl: 'https://nexa-lovelab.com',
  tiktokTemplateText: 'プロフィールから無料で占えます👇',
  insertPosition: 'end' as const,
  tiktokInsertPosition: 'end' as const,
  autoCtaEnabled: true,
  hashtagMode: 'あり' as const,
  scheduleMorning: '07:00',
  scheduleNoon: '12:00',
  scheduleNight: '21:00',
};

const FORTUNE_THEMES = [
  '片思い', '復縁', '運命の人', '相性', '好き避け',
  '連絡待ち', '彼の本音', '不倫', '縁切り', '恋愛運',
  '告白タイミング', '遠距離恋愛', '元カレ', '運命鑑定',
];

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
  const [open, setOpen] = React.useState(false);
  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl px-3 py-1.5 bg-white"
        >
          <ClockIcon className="w-3 h-3" />
          {title}（{items.length}件）
          <span className="ml-1">{open ? '▲' : '▼'}</span>
        </button>
      </div>
      {open && (
        <div className="absolute z-10 top-8 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 border-b border-slate-100 last:border-0"
            >
              <button
                type="button"
                onClick={() => { onSelect(item); setOpen(false); }}
                className="flex-1 text-sm text-slate-700 text-left truncate hover:text-indigo-600"
              >
                {item}
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="shrink-0 text-slate-300 hover:text-red-500 ml-2"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const InputForm: React.FC<InputFormProps> = ({
  onGenerate,
  onCancel,
  loadingState,
  progress,
  relatedThemes = [],
}) => {
  const isLoading = loadingState === LoadingState.LOADING;
  const [savedNotification, setSavedNotification] = useState<{ section: string; timestamp: number } | null>(null);

  const showSaveNotification = (section: string) => {
    setSavedNotification({ section, timestamp: Date.now() });
    setTimeout(() => setSavedNotification(null), 2000);
  };

  const [theme, setTheme] = useState<string>(_initSettings.theme);
  const [gender, setGender] = useState<string>(_initSettings.gender);
  const [age, setAge] = useState<string>(_initSettings.age);
  const [length, setLength] = useState<string>(_initSettings.length);
  const [templateText, setTemplateText] = useState<string>(_initSettings.templateText);
  const [templateUrl, setTemplateUrl] = useState<string>(_initSettings.templateUrl);
  const [tiktokTemplateText, setTiktokTemplateText] = useState<string>(_initSettings.tiktokTemplateText);
  const [insertPosition, setInsertPosition] = useState<'start' | 'end'>(_initSettings.insertPosition);
  const [tiktokInsertPosition, setTiktokInsertPosition] = useState<'start' | 'end' | 'both'>(_initSettings.tiktokInsertPosition);
  const [hashtagMode, setHashtagMode] = useState<'あり' | 'なし'>(_initSettings.hashtagMode);
  const [scheduleMorning, setScheduleMorning] = useState<string>(_initSettings.scheduleMorning);
  const [scheduleNoon, setScheduleNoon] = useState<string>(_initSettings.scheduleNoon);
  const [scheduleNight, setScheduleNight] = useState<string>(_initSettings.scheduleNight);
  const [xPhrase, setXPhrase] = useState<string>(_initSettings.xPhrase);
  const [xUrl, setXUrl] = useState<string>(_initSettings.xUrl);
  const [threadsPhrase, setThreadsPhrase] = useState<string>(_initSettings.threadsPhrase);
  const [threadsUrl, setThreadsUrl] = useState<string>(_initSettings.threadsUrl);
  const [igYtPhrase, setIgYtPhrase] = useState<string>(_initSettings.igYtPhrase);
  const [xLength, setXLength] = useState<string>(_initSettings.xLength);
  const [threadsLength, setThreadsLength] = useState<string>(_initSettings.threadsLength);
  const [autoCtaEnabled, setAutoCtaEnabled] = useState(true);
  const [openCommon, setOpenCommon] = useState(false);
  const [openTiktok, setOpenTiktok] = useState(false);
  const [openX, setOpenX] = useState(false);
  const [openThreads, setOpenThreads] = useState(false);
  const [openIgYt, setOpenIgYt] = useState(false);
  const [openAutomation, setOpenAutomation] = useState(true);
  const [showThemeHistory, setShowThemeHistory] = useState(false);

  // 毎レンダリングで最新値を ref に保持（beforeunload で同期保存するため）
  const settingsRef = useRef<FormSettings>({
    theme, gender, age, length,
    templateText, templateUrl, tiktokTemplateText,
    insertPosition, tiktokInsertPosition, hashtagMode,
    scheduleMorning, scheduleNoon, scheduleNight,
    xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase,
    xLength, threadsLength,
  });
  settingsRef.current = {
    theme, gender, age, length,
    templateText, templateUrl, tiktokTemplateText,
    insertPosition, tiktokInsertPosition, hashtagMode,
    scheduleMorning, scheduleNoon, scheduleNight,
    xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase,
    xLength, threadsLength,
  };

  // タブを閉じる・バックグラウンド移行時にlocalStorage＋Cookieへ同期保存
  useEffect(() => {
    const save = () => {
      const s = settingsRef.current;
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
      saveToCookie(s);
      // 履歴を直接保存（デバウンスタイマーがキャンセルされる前に）
      if (s.theme) addHistory(HISTORY_KEYS_CONST.theme, s.theme);
      if (s.templateText) addHistory(HISTORY_KEYS_CONST.templateText, s.templateText);
      if (s.templateUrl) addHistory(HISTORY_KEYS_CONST.templateUrl, s.templateUrl);
      addHistory(HISTORY_KEYS_CONST.tiktokTemplateText, s.tiktokTemplateText || '（削除）');
      if (s.xPhrase) addHistory(HISTORY_KEYS_CONST.theme, s.xPhrase); // X設定も履歴に保存
      addHistory(HISTORY_KEYS_CONST.gender, s.gender);
      addHistory(HISTORY_KEYS_CONST.age, s.age);
      addHistory(HISTORY_KEYS_CONST.length, s.length);
      addHistory(HISTORY_KEYS_CONST.hashtagMode, s.hashtagMode);
      addHistory(HISTORY_KEYS_CONST.insertPosition, s.insertPosition);
      addHistory(HISTORY_KEYS_CONST.tiktokInsertPosition, s.tiktokInsertPosition);
    };
    window.addEventListener('beforeunload', save);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') save();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('beforeunload', save);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // 設定変更を検知してlocalStorage＋Cookieへ即座に保存
  useEffect(() => {
    const s: FormSettings = {
      theme, gender, age, length,
      templateText, templateUrl, tiktokTemplateText,
      insertPosition, tiktokInsertPosition, hashtagMode,
      scheduleMorning, scheduleNoon, scheduleNight,
      xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase,
    };
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
    saveToCookie(s);
  }, [theme, gender, age, length, templateText, templateUrl, tiktokTemplateText,
      insertPosition, tiktokInsertPosition, hashtagMode, scheduleMorning, scheduleNoon, scheduleNight,
      xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase]);

  // 設定変更時にlocalStorage＋Cookieへ即時保存
  const updateSetting = <K extends keyof FormSettings>(
    setter: (v: FormSettings[K]) => void,
    key: K,
    value: FormSettings[K]
  ) => {
    setter(value);
    const next = { ...settingsRef.current, [key]: value };
    settingsRef.current = next;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch {}
    saveToCookie(next);
  };

  const applyFortunePreset = () => {
    setGender(FORTUNE_PRESET.gender);
    setAge(FORTUNE_PRESET.age);
    setLength(FORTUNE_PRESET.length);
    setTemplateText(FORTUNE_PRESET.templateText);
    setTemplateUrl(FORTUNE_PRESET.templateUrl);
    setTiktokTemplateText(FORTUNE_PRESET.tiktokTemplateText);
    setInsertPosition(FORTUNE_PRESET.insertPosition);
    setTiktokInsertPosition(FORTUNE_PRESET.tiktokInsertPosition);
    setAutoCtaEnabled(FORTUNE_PRESET.autoCtaEnabled);
    setHashtagMode(FORTUNE_PRESET.hashtagMode);
    setScheduleMorning(FORTUNE_PRESET.scheduleMorning);
    setScheduleNoon(FORTUNE_PRESET.scheduleNoon);
    setScheduleNight(FORTUNE_PRESET.scheduleNight);
    setOpenTiktok(true);
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const HISTORY_KEYS = HISTORY_KEYS_CONST;

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

  // テキスト入力系：800ms デバウンスで保存
  useEffect(() => {
    if (!theme.trim()) return;
    const t = setTimeout(() => setThemeHistory(addHistory(HISTORY_KEYS.theme, theme)), 800);
    return () => clearTimeout(t);
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!templateText.trim()) return;
    const t = setTimeout(() => setTemplateTextHistory(addHistory(HISTORY_KEYS.templateText, templateText)), 800);
    return () => clearTimeout(t);
  }, [templateText]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!templateUrl.trim()) return;
    const t = setTimeout(() => setTemplateUrlHistory(addHistory(HISTORY_KEYS.templateUrl, templateUrl)), 800);
    return () => clearTimeout(t);
  }, [templateUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // 空欄も「（削除）」として履歴に保存する
    const val = tiktokTemplateText.trim() || '（削除）';
    const t = setTimeout(() => setTiktokTemplateTextHistory(addHistory(HISTORY_KEYS.tiktokTemplateText, val)), 800);
    return () => clearTimeout(t);
  }, [tiktokTemplateText]); // eslint-disable-line react-hooks/exhaustive-deps

  // 選択系：即時保存
  useEffect(() => { setGenderHistory(addHistory(HISTORY_KEYS.gender, gender)); }, [gender]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setAgeHistory(addHistory(HISTORY_KEYS.age, age)); }, [age]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setLengthHistory(addHistory(HISTORY_KEYS.length, length)); }, [length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setHashtagModeHistory(addHistory(HISTORY_KEYS.hashtagMode, hashtagMode)); }, [hashtagMode]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setInsertPositionHistory(addHistory(HISTORY_KEYS.insertPosition, insertPosition)); }, [insertPosition]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setTiktokInsertPositionHistory(addHistory(HISTORY_KEYS.tiktokInsertPosition, tiktokInsertPosition)); }, [tiktokInsertPosition]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveAllHistories = () => {
    // 生成時にも保存（デバウンスを待たずに即時確定）
    setThemeHistory(addHistory(HISTORY_KEYS.theme, theme));
    setTemplateTextHistory(addHistory(HISTORY_KEYS.templateText, templateText));
    setTemplateUrlHistory(addHistory(HISTORY_KEYS.templateUrl, templateUrl));
    setTiktokTemplateTextHistory(addHistory(HISTORY_KEYS.tiktokTemplateText, tiktokTemplateText || '（削除）'));
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
    onGenerate(theme, length, gender, age, templateText, templateUrl, tiktokTemplateText, insertPosition, tiktokInsertPosition, autoCtaEnabled, scheduleTimes, hashtagMode, 'script', xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase, xLength, threadsLength);
  };

  const handleSubmitWithMode = (mode: GenerateMode) => {
    if (!theme.trim()) return;
    saveAllHistories();
    onGenerate(theme, length, gender, age, templateText, templateUrl, tiktokTemplateText, insertPosition, tiktokInsertPosition, autoCtaEnabled, scheduleTimes, hashtagMode, mode, xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase, xLength, threadsLength);
  };

  return (
    <div className="w-full bg-white rounded-[40px] shadow-2xl p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black">SNS投稿を一瞬で作成</h2>
          <p className="text-sm text-gray-500">テーマを入れるだけで投稿完成</p>
        </div>

        {/* 占いテーマ候補 */}
        <div className="rounded-3xl overflow-hidden border border-purple-200 bg-gradient-to-br from-[#1a0035] to-[#3d0068] px-5 py-4">
          <div className="text-xs font-black text-purple-300 uppercase tracking-widest mb-3">✦ 占いテーマ候補 ✦</div>
          <div className="flex flex-wrap gap-2">
            {FORTUNE_THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                  theme === t
                    ? 'bg-pink-500 text-white border-pink-400'
                    : 'bg-white/10 text-purple-100 border-white/20 hover:bg-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
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
              onChange={(e) => updateSetting(setTheme, 'theme', e.target.value)}
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

          {relatedThemes.length > 0 && (
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-black text-orange-500 uppercase tracking-wider">
                <span>🔥</span>
                次のバズるテーマ（前回の関連）
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedThemes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border border-orange-300 bg-white text-orange-600 hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
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
                onChange={(e) => updateSetting(setScheduleMorning, 'scheduleMorning', e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
              <input
                type="time"
                value={scheduleNoon}
                onChange={(e) => updateSetting(setScheduleNoon, 'scheduleNoon', e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
              <input
                type="time"
                value={scheduleNight}
                onChange={(e) => updateSetting(setScheduleNight, 'scheduleNight', e.target.value)}
                className="w-full p-3 rounded-xl border"
              />
            </div>

          </div>
        )}

        <div className="space-y-4">
          {/* 投稿設定：常時表示のピル型セレクター */}
          <div className="p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
            <div className="font-black text-slate-700 text-sm tracking-wide">📋 投稿設定</div>

            {/* 性別 */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500">性別</div>
              <div className="flex flex-wrap gap-2">
                {['女性', '男性', '指定なし'].map((v) => (
                  <button key={v} type="button" onClick={() => updateSetting(setGender, 'gender', v)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${gender === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* 年代 */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500">年代</div>
              <div className="flex flex-wrap gap-2">
                {['20代', '30代', '40代', '50代以上', '指定なし'].map((v) => (
                  <button key={v} type="button" onClick={() => updateSetting(setAge, 'age', v)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${age === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* 文字数 */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500">文字数</div>
              <div className="flex flex-wrap gap-2">
                {['200文字', '300文字', '500文字'].map((v) => (
                  <button key={v} type="button" onClick={() => updateSetting(setLength, 'length', v)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${length === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* ハッシュタグ */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500">ハッシュタグ</div>
              <div className="flex flex-wrap gap-2">
                {[['あり', 'ハッシュタグあり'], ['なし', 'ハッシュタグなし']].map(([v, label]) => (
                  <button key={v} type="button" onClick={() => updateSetting(setHashtagMode, 'hashtagMode', v as 'あり' | 'なし')}
                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95 ${hashtagMode === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SectionButton
            title="note設定"
            subtitle="決まり文・URL・挿入位置"
            isOpen={openCommon}
            onClick={() => setOpenCommon(!openCommon)}
            className="bg-indigo-100 border-indigo-200"
          />

          {openCommon && (
            <div className="p-4 space-y-4 bg-indigo-50 rounded-2xl border border-indigo-200">
              <input
                value={templateText}
                onChange={(e) => updateSetting(setTemplateText, 'templateText', e.target.value)}
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
                onChange={(e) => updateSetting(setTemplateUrl, 'templateUrl', e.target.value)}
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
                onChange={(e) => updateSetting(setInsertPosition, 'insertPosition', e.target.value as 'start' | 'end')}
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
                onChange={(e) => updateSetting(setTiktokTemplateText, 'tiktokTemplateText', e.target.value)}
                className="w-full p-3 rounded-xl border"
                placeholder="続きはプロフィールから👇"
              />
              <HistoryChips
                title="TikTok決まり文履歴"
                items={tiktokTemplateTextHistory}
                onSelect={(v) => updateSetting(setTiktokTemplateText, 'tiktokTemplateText', v === '（削除）' ? '' : v)}
                onDelete={(value) => setTiktokTemplateTextHistory(removeHistory(HISTORY_KEYS.tiktokTemplateText, value))}
              />

              <select
                value={tiktokInsertPosition}
                onChange={(e) =>
                  updateSetting(setTiktokInsertPosition, 'tiktokInsertPosition', e.target.value as 'start' | 'end' | 'both')
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

        {/* X設定 */}
        <SectionButton
          title="X（Twitter）設定"
          subtitle="誘導語句・リンク（140全角字以内に収まるよう自動調整）"
          isOpen={openX}
          onClick={() => setOpenX(!openX)}
          className="bg-sky-100 border-sky-200"
        />
        {openX && (
          <div className="p-4 space-y-3 bg-sky-50 rounded-2xl border border-sky-200">
            <input
              value={xPhrase}
              onChange={(e) => updateSetting(setXPhrase, 'xPhrase', e.target.value)}
              className="w-full p-3 rounded-xl border"
              placeholder="▼無料で試す"
            />
            <input
              value={xUrl}
              onChange={(e) => updateSetting(setXUrl, 'xUrl', e.target.value)}
              className="w-full p-3 rounded-xl border"
              placeholder="https://lovelab-sns-redirect.vercel.app"
            />
          </div>
        )}

        {/* Threads設定 */}
        <SectionButton
          title="Threads設定"
          subtitle="誘導語句・リンク（最大500文字）"
          isOpen={openThreads}
          onClick={() => setOpenThreads(!openThreads)}
          className="bg-purple-100 border-purple-200"
        />
        {openThreads && (
          <div className="p-4 space-y-3 bg-purple-50 rounded-2xl border border-purple-200">
            <input
              value={threadsPhrase}
              onChange={(e) => updateSetting(setThreadsPhrase, 'threadsPhrase', e.target.value)}
              className="w-full p-3 rounded-xl border"
              placeholder="▼無料で試す"
            />
            <input
              value={threadsUrl}
              onChange={(e) => updateSetting(setThreadsUrl, 'threadsUrl', e.target.value)}
              className="w-full p-3 rounded-xl border"
              placeholder="https://lovelab-sns-redirect.vercel.app"
            />
          </div>
        )}

        {/* Instagram/YouTube設定 */}
        <SectionButton
          title="Instagram・YouTube設定"
          subtitle="プロフィール誘導文（URLなし）"
          isOpen={openIgYt}
          onClick={() => setOpenIgYt(!openIgYt)}
          className="bg-pink-100 border-pink-200"
        />
        {openIgYt && (
          <div className="p-4 space-y-3 bg-pink-50 rounded-2xl border border-pink-200">
            <div className="text-xs font-bold text-slate-500 mb-1">候補から選ぶ</div>
            <div className="flex flex-wrap gap-2">
              {IG_YT_PHRASE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setIgYtPhrase(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${igYtPhrase === p ? 'bg-pink-500 text-white border-pink-400' : 'bg-white text-slate-600 border-slate-300 hover:border-pink-400'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              value={igYtPhrase}
              onChange={(e) => updateSetting(setIgYtPhrase, 'igYtPhrase', e.target.value)}
              className="w-full p-3 rounded-xl border"
              placeholder="自由記入（例：プロフィールへ👆）"
            />
          </div>
        )}

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
