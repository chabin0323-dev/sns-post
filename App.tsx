import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm, GenerateMode } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { UserGuide } from './components/UserGuide';
import { LoadingState, GeneratedPost } from './types';
import { generateSNSPostContent, generateRelatedThemes } from './services/localPostGenerator';
import {
  analyzeBuzzFromHistory,
  buildPostPackage,
  generateBuzzScriptPack,
  generateInfiniteIdeaPack,
  generateSchedulePack,
  generateTrendPack,
} from './services/tiktokAutomation';
import { buildAutoVideoFromScenes } from './services/localVideoBuilder';

const STORAGE_KEY = 'latest_generated_post';
const GENERATED_HISTORY_KEY = 'generated_post_history_v3';

const isValidSavedPost = (data: any): data is GeneratedPost => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.capcutScript === 'string' &&
    typeof data.xPost === 'string' &&
    Array.isArray(data.hashtags)
  );
};

const sanitizePost = (data: any): GeneratedPost | null => {
  if (!isValidSavedPost(data)) return null;
  return {
    ...data,
    threadsPost: typeof data.threadsPost === 'string' ? data.threadsPost : '',
    twitchPost: typeof data.twitchPost === 'string' ? data.twitchPost : '',
    showroomPost: typeof data.showroomPost === 'string' ? data.showroomPost : '',
    instagramPost: typeof data.instagramPost === 'string' ? data.instagramPost : '',
    youtubePost: typeof data.youtubePost === 'string' ? data.youtubePost : '',
    timestamp: data.timestamp ?? new Date().toISOString(),
    autoVideo: data.autoVideo
      ? {
          videoDataUrl: typeof data.autoVideo.videoDataUrl === 'string' ? data.autoVideo.videoDataUrl : '',
          videoMimeType: typeof data.autoVideo.videoMimeType === 'string' ? data.autoVideo.videoMimeType : '',
          sceneImages: Array.isArray(data.autoVideo.sceneImages) ? data.autoVideo.sceneImages : [],
          durationSec: typeof data.autoVideo.durationSec === 'number' ? data.autoVideo.durationSec : 0,
        }
      : null,
  };
};

const stripHeavyVideoData = (post: GeneratedPost): GeneratedPost => {
  return {
    ...post,
    autoVideo: post.autoVideo
      ? {
          ...post.autoVideo,
          videoDataUrl: '',
          sceneImages: [],
        }
      : null,
  };
};

const safeSaveToLocalStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`localStorage save failed: ${key}`, error);
    return false;
  }
};

const readGeneratedHistory = (): GeneratedPost[] => {
  try {
    const raw = localStorage.getItem(GENERATED_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizePost).filter((item): item is GeneratedPost => !!item);
  } catch {
    return [];
  }
};

const getHistoryItemKey = (post: GeneratedPost, index?: number) =>
  `${post.timestamp ?? 'time'}__${post.title ?? 'title'}__${post.theme ?? 'theme'}__${index ?? ''}`;

// URLセーフBase64 → UTF-8文字列に正しく変換（日本語対応）
const b64ToUtf8 = (b64: string): string => {
  // URLセーフ文字を標準Base64に戻す
  const standard = b64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = standard + '==='.slice((standard.length + 3) % 4);
  const binStr = atob(padded);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

// 起動時にURLパラメータから設定をインポート（スマホへの設定転送用）
// 戻り値: 何をインポートしたか（成功メッセージ表示用）
const importSettingsFromUrl = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s');
    if (!encoded) return null;
    const json = b64ToUtf8(encoded);
    const parsed = JSON.parse(json);
    let imported = '';
    if (parsed && typeof parsed === 'object') {
      if (parsed.settings && typeof parsed.settings === 'object') {
        const existing = localStorage.getItem('sns_form_settings_v1');
        const base = existing ? JSON.parse(existing) : {};
        const merged = { ...base, ...parsed.settings };
        localStorage.setItem('sns_form_settings_v1', JSON.stringify(merged));
        // CookieにもURLを保存（iOS SafariのITP対策）
        const exp = new Date(Date.now() + 365 * 864e5).toUTCString();
        document.cookie = `snss1=${encodeURIComponent(JSON.stringify(merged))};expires=${exp};path=/;SameSite=Lax`;
        imported += '設定';
      }
      if (parsed.accounts && typeof parsed.accounts === 'object') {
        const existing = localStorage.getItem('sns_accounts_v1');
        const base: Record<string, Record<string, string>> = existing ? JSON.parse(existing) : {};
        // Deep merge: プラットフォームごとに id/password/memo を個別マージ（上書きしない）
        const merged = { ...base };
        for (const [key, val] of Object.entries(parsed.accounts as Record<string, Record<string, string>>)) {
          merged[key] = { ...(base[key] || {}), ...val };
        }
        localStorage.setItem('sns_accounts_v1', JSON.stringify(merged));
        imported += imported ? '・アカウント' : 'アカウント';
      }
      if (!parsed.settings && !parsed.accounts) {
        const existing = localStorage.getItem('sns_form_settings_v1');
        const base = existing ? JSON.parse(existing) : {};
        localStorage.setItem('sns_form_settings_v1', JSON.stringify({ ...base, ...parsed }));
        imported = '設定';
      }
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('s');
    url.searchParams.delete('t');
    if (imported) {
      // sessionStorageにフラグを保存してからリロード
      // (リロード後もタブ内sessionStorageは保持される)
      sessionStorage.setItem('_qr_imported', imported);
      window.location.replace(url.toString());
    } else {
      window.history.replaceState({}, '', url.toString());
    }
    return null; // リロードするので戻り値は不要
  } catch (e) {
    console.error('Settings import failed:', e);
    return null;
  }
};
const importedLabel = importSettingsFromUrl();

const App: React.FC = () => {
  const [importNotice] = useState<string | null>(() => {
    const notice = sessionStorage.getItem('_qr_imported');
    if (notice) {
      sessionStorage.removeItem('_qr_imported');
      return notice;
    }
    return null;
  });

  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const normalized = sanitizePost(parsed);
      if (normalized) return normalized;
      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const [generatedHistory, setGeneratedHistory] = useState<GeneratedPost[]>(() => readGeneratedHistory());
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [showGuide, setShowGuide] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [relatedThemes, setRelatedThemes] = useState<string[]>([]);
  const progressIntervalRef = useRef<number | null>(null);

  // 最新値を ref で追跡（beforeunload で同期保存するため）
  const currentPostRef = useRef(currentPost);
  currentPostRef.current = currentPost;
  const generatedHistoryRef = useRef(generatedHistory);
  generatedHistoryRef.current = generatedHistory;

  useEffect(() => {
    if (!currentPost) return;
    const lightPost = stripHeavyVideoData(currentPost);
    const saved = safeSaveToLocalStorage(STORAGE_KEY, lightPost);
    if (saved) setLastSaved(new Date());
  }, [currentPost]);

  useEffect(() => {
    const lightHistory = generatedHistory.map(stripHeavyVideoData);
    safeSaveToLocalStorage(GENERATED_HISTORY_KEY, lightHistory);
  }, [generatedHistory]);

  // タブを閉じる・切り替える直前に同期保存
  useEffect(() => {
    const persist = () => {
      if (currentPostRef.current) {
        safeSaveToLocalStorage(STORAGE_KEY, stripHeavyVideoData(currentPostRef.current));
      }
      const lightHistory = generatedHistoryRef.current.map(stripHeavyVideoData);
      safeSaveToLocalStorage(GENERATED_HISTORY_KEY, lightHistory);
    };
    const save = (e: BeforeUnloadEvent) => {
      if (loadingState === LoadingState.LOADING) {
        e.preventDefault();
        e.returnValue = '入力内容が消去されますがよろしいですか？';
      }
      persist();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    window.addEventListener('beforeunload', save);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('beforeunload', save);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loadingState]);

  const startProgress = () => {
    setProgress(0);

    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 150);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  };

  const handleGenerate = async (
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
    mode: GenerateMode = 'script',
    xPhrase: string = '▼無料で試す',
    xUrl: string = 'https://lovelab-sns-redirect.vercel.app',
    threadsPhrase: string = '▼無料で試す',
    threadsUrl: string = 'https://lovelab-sns-redirect.vercel.app',
    igYtPhrase: string = '詳細はプロフィールのリンクから🔗'
  ) => {
    setLoadingState(LoadingState.LOADING);
    setShowGuide(false);
    startProgress();

    try {
      const base = generateSNSPostContent(
        theme, length, gender, age,
        templateText, templateUrl, tiktokTemplateText,
        insertPosition, tiktokInsertPosition, hashtagMode,
        xPhrase, xUrl, threadsPhrase, threadsUrl, igYtPhrase
      );

      const historyForAnalysis = generatedHistory.map(stripHeavyVideoData);

      // モード別にデータ生成を制御
      const buzzScript   = (mode === 'video' || mode === 'full_auto')
        ? generateBuzzScriptPack(theme, autoCtaEnabled) : undefined;
      const trendPack    = (mode === 'full_auto')
        ? generateTrendPack(theme) : undefined;
      const ideaPack     = (mode === 'full_auto')
        ? generateInfiniteIdeaPack(theme) : undefined;
      const schedulePack = (mode === 'full_auto')
        ? generateSchedulePack(scheduleTimes, theme) : undefined;
      const postPackage  = (mode === 'post_data' || mode === 'full_auto')
        ? buildPostPackage(theme, base.hashtags, autoCtaEnabled) : undefined;
      const buzzAnalysis = (mode === 'full_auto')
        ? analyzeBuzzFromHistory(theme, historyForAnalysis) : undefined;

      const modeBase = base;

      const result: GeneratedPost = {
        ...modeBase,
        theme,
        timestamp: new Date().toISOString(),
        autoCtaEnabled,
        scheduleTimes,
        hashtagMode,
        buzzScript,
        trendPack,
        ideaPack,
        schedulePack,
        postPackage,
        buzzAnalysis,
        autoVideo: null,
      };

      setCurrentPost(result);
      setGeneratedHistory((prev) => [result, ...prev].slice(0, 30));
      setRelatedThemes(generateRelatedThemes(theme));
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    } finally {
      stopProgress();
    }
  };

  const handleCancel = () => {
    setLoadingState(LoadingState.IDLE);
    stopProgress();
  };

  const handleSelectHistory = (post: GeneratedPost) => {
    setCurrentPost(post);
    setLoadingState(LoadingState.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setGeneratedHistory([]);
    setCurrentPost(null);
    setLoadingState(LoadingState.IDLE);
    localStorage.removeItem(GENERATED_HISTORY_KEY);
  };

  const handleDeleteHistory = (post: GeneratedPost, index: number) => {
    const targetKey = getHistoryItemKey(post, index);

    setGeneratedHistory((prev) => {
      const next = prev.filter((item, i) => getHistoryItemKey(item, i) !== targetKey);

      if (currentPost && getHistoryItemKey(currentPost) === getHistoryItemKey(post)) {
        setCurrentPost(next.length > 0 ? next[0] : null);
        if (next.length === 0) {
          setLoadingState(LoadingState.IDLE);
        }
      }

      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onToggleGuide={() => setShowGuide(!showGuide)} />

      <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-12 flex-grow w-full">
        {importNotice && (
          <div className="rounded-2xl bg-emerald-500 text-white font-black text-center py-4 px-6 text-sm shadow-lg">
            ✅ QRコードから転送完了！{importNotice}を保存しました。
          </div>
        )}
        {lastSaved && (
          <div className="fixed top-20 right-4 z-50 animate-fade-in">
            <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-400/50 shadow-lg shadow-emerald-500/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Auto-Saved {lastSaved.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            AIで、魅力的な
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500">
              TikTok投稿
            </span>
            を。
          </h2>
          <p className="text-sm md:text-base text-white/60 font-bold">
            台本・動画・投稿データをローカルだけでまとめて自動生成
          </p>
        </div>

        {showGuide && (
          <div className="animate-in fade-in zoom-in duration-300">
            <UserGuide onClose={() => setShowGuide(false)} />
          </div>
        )}

        <InputForm
          onGenerate={handleGenerate}
          onCancel={handleCancel}
          loadingState={loadingState}
          progress={progress}
          relatedThemes={relatedThemes}
        />

        {(loadingState === LoadingState.SUCCESS || (currentPost && loadingState === LoadingState.IDLE)) && currentPost && (
          <div className="space-y-6">
            <ResultCard
              post={currentPost}
              history={generatedHistory.map(stripHeavyVideoData)}
              onSelectHistory={handleSelectHistory}
              onDeleteHistory={handleDeleteHistory}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="p-6 bg-red-500/10 text-red-400 rounded-2xl text-center font-bold border border-red-500/20">
            生成に失敗しました。もう一度お試しください。
          </div>
        )}
      </main>

      <footer className="w-full py-20 flex justify-center items-center select-none">
        <div className="flex items-center gap-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
              Mike
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mt-1">
              ver.5
            </span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
