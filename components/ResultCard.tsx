import React, { useMemo, useState } from 'react';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { GeneratedPost, AutoVideoResult } from '../types';
import { buildAutoVideoFromScenes } from '../services/localVideoBuilder';

type ChannelBlock = {
  labels: string[];
  text: string;
  theme: 'light' | 'dark' | 'sky' | 'pink' | 'red' | 'amber' | 'violet' | 'emerald';
};

const normalizeText = (text: string) => text.trim();

const groupChannels = (post: GeneratedPost): ChannelBlock[] => {
  const source = [
    { label: 'note', text: post.content, theme: 'light' as const },
    { label: 'TikTok', text: post.capcutScript, theme: 'dark' as const },
    { label: 'X', text: post.xPost, theme: 'sky' as const },
    { label: 'Instagram', text: post.instagramPost, theme: 'pink' as const },
    { label: 'YouTube', text: post.youtubePost, theme: 'red' as const },
    { label: 'AIバズ台本', text: post.buzzScript?.fullScript || '', theme: 'amber' as const },
    {
      label: 'トレンド取得',
      text: post.trendPack
        ? [
            `トレンド風タイトル：${post.trendPack.generatedTrendTitle}`,
            `キーワード：${post.trendPack.trendKeywords.join(' / ')}`,
            `フック：${post.trendPack.hookPatterns.join(' / ')}`,
            `構成：${post.trendPack.structureTemplates.join(' / ')}`,
          ].join('\n')
        : '',
      theme: 'violet' as const,
    },
    {
      label: 'ネタ無限生成',
      text: post.ideaPack
        ? [
            post.ideaPack.fortuneSummary,
            '',
            post.ideaPack.loveStory,
            '',
            ...post.ideaPack.endlessIdeas.map((item, index) => `${index + 1}. ${item}`),
          ].join('\n')
        : '',
      theme: 'emerald' as const,
    },
    { label: '投稿データ', text: post.postPackage?.readyToPostText || '', theme: 'amber' as const },
    {
      label: 'バズ分析',
      text: post.buzzAnalysis
        ? [
            `スコア：${post.buzzAnalysis.score}`,
            `強み：${post.buzzAnalysis.strengths.join(' / ')}`,
            `弱点：${post.buzzAnalysis.weakPoints.join(' / ') || 'なし'}`,
            `最適化：${post.buzzAnalysis.optimizationNext.join(' / ')}`,
            `履歴テーマ：${post.buzzAnalysis.topThemesFromHistory.join(' / ') || 'なし'}`,
            `履歴フック：${post.buzzAnalysis.topHookPatternsFromHistory.join(' / ') || 'なし'}`,
          ].join('\n')
        : '',
      theme: 'violet' as const,
    },
  ].filter((item) => normalizeText(item.text) !== '');

  const grouped = new Map<string, ChannelBlock>();

  source.forEach((item) => {
    const key = normalizeText(item.text);
    if (grouped.has(key)) {
      grouped.get(key)!.labels.push(item.label);
    } else {
      grouped.set(key, {
        labels: [item.label],
        text: item.text,
        theme: item.theme,
      });
    }
  });

  return Array.from(grouped.values());
};

const themeClassMap = {
  light: {
    wrap: 'bg-white border-slate-100',
    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    text: 'text-slate-700 bg-slate-50/40 border-slate-100',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
  },
  dark: {
    wrap: 'bg-slate-900 border-slate-800',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
    text: 'text-cyan-50 bg-slate-950/50 border-slate-800',
    button: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
  },
  sky: {
    wrap: 'bg-sky-50 border-sky-100',
    badge: 'bg-white text-sky-600 border-sky-100',
    text: 'text-slate-700 bg-white/70 border-sky-100',
    button: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200',
  },
  pink: {
    wrap: 'bg-pink-50 border-pink-100',
    badge: 'bg-white text-pink-600 border-pink-100',
    text: 'text-slate-700 bg-white/70 border-pink-100',
    button: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200',
  },
  red: {
    wrap: 'bg-red-50 border-red-100',
    badge: 'bg-white text-red-600 border-red-100',
    text: 'text-slate-700 bg-white/70 border-red-100',
    button: 'bg-red-500 hover:bg-red-600 text-white shadow-red-200',
  },
  amber: {
    wrap: 'bg-amber-50 border-amber-100',
    badge: 'bg-white text-amber-700 border-amber-100',
    text: 'text-slate-700 bg-white/70 border-amber-100',
    button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200',
  },
  violet: {
    wrap: 'bg-violet-50 border-violet-100',
    badge: 'bg-white text-violet-700 border-violet-100',
    text: 'text-slate-700 bg-white/70 border-violet-100',
    button: 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-200',
  },
  emerald: {
    wrap: 'bg-emerald-50 border-emerald-100',
    badge: 'bg-white text-emerald-700 border-emerald-100',
    text: 'text-slate-700 bg-white/70 border-emerald-100',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200',
  },
};

interface ResultCardProps {
  post: GeneratedPost;
  history?: GeneratedPost[];
  onSelectHistory?: (post: GeneratedPost) => void;
  onDeleteHistory?: (post: GeneratedPost, index: number) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  post,
  history = [],
  onSelectHistory,
  onDeleteHistory,
}) => {
  const [copiedKey, setCopiedKey] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [localVideo, setLocalVideo] = useState<AutoVideoResult | null>(post.autoVideo || null);

  const groupedBlocks = useMemo(() => groupChannels(post), [post]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleGenerateVideo = async () => {
    if (!post.buzzScript?.scenes?.length) return;

    setVideoLoading(true);
    try {
      const result = await buildAutoVideoFromScenes(post.buzzScript.scenes);
      if (result) {
        setLocalVideo(result);
      }
    } catch (error) {
      console.error('Video generation failed', error);
      alert('動画生成に失敗しました。もう一度お試しください。');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {groupedBlocks.map((block, index) => {
        const themeClasses = themeClassMap[block.theme];
        const copyKey = `${block.labels.join('-')}-${index}`;

        return (
          <div
            key={copyKey}
            className={`rounded-[40px] shadow-2xl overflow-hidden border ${themeClasses.wrap}`}
          >
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap gap-2 mb-8">
                <span
                  className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider ${themeClasses.badge}`}
                >
                  {block.labels.join('・')}
                </span>
                {block.labels.length > 1 && (
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider bg-emerald-50 text-emerald-600 border-emerald-100">
                    共通
                  </span>
                )}
              </div>

              <div
                className={`whitespace-pre-wrap leading-relaxed text-lg mb-10 font-medium rounded-3xl border p-6 ${themeClasses.text}`}
              >
                {block.text}
              </div>

              <button
                onClick={() => handleCopy(block.text, copyKey)}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg ${themeClasses.button}`}
              >
                {copiedKey === copyKey ? (
                  <>
                    <CheckIcon className="w-6 h-6" />
                    コピー完了！
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-6 h-6" />
                    {block.labels.join('・')}としてコピー
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {post.buzzScript?.scenes?.length ? (
        <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
          <div className="p-8 md:p-10 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Auto Video</div>
                <h3 className="text-2xl font-black text-slate-800 mt-2">記事 → 動画 自動変換</h3>
              </div>

              <div className="flex gap-3 flex-wrap">
                {!localVideo?.videoDataUrl && (
                  <button
                    type="button"
                    onClick={handleGenerateVideo}
                    disabled={videoLoading}
                    className="px-5 py-3 rounded-2xl bg-black text-white font-black disabled:opacity-50"
                  >
                    {videoLoading ? '動画生成中…' : '動画を生成'}
                  </button>
                )}

                {localVideo?.videoDataUrl && (
                  <a
                    href={localVideo.videoDataUrl}
                    download={`${post.theme || 'tiktok-auto-video'}.webm`}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-black"
                  >
                    動画を保存
                  </a>
                )}
              </div>
            </div>

            {localVideo?.videoDataUrl ? (
              <video
                controls
                className="w-full rounded-3xl bg-black"
                src={localVideo.videoDataUrl}
              />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 font-bold text-slate-600">
                動画はまだ生成していません。必要な時だけ「動画を生成」を押してください。
              </div>
            )}

            {(localVideo?.sceneImages?.length || post.buzzScript?.scenes?.length) ? (
              <div className="space-y-4">
                <div className="text-sm font-black text-slate-700">シーン構成</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.buzzScript.scenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {scene.englishKeyword}
                      </div>
                      <div className="text-lg font-black text-slate-800 mt-2">
                        {scene.title}
                      </div>
                      <div className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">
                        {scene.text}
                      </div>
                      <div className="text-xs text-slate-400 mt-3">
                        {scene.durationSec}秒
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {localVideo?.sceneImages?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {localVideo.sceneImages.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    src={src}
                    alt={`scene-${index + 1}`}
                    className="w-full rounded-2xl border border-slate-200"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {post.schedulePack?.length ? (
        <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
          <div className="p-8 md:p-10 space-y-6">
            <div>
              <div className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Schedule</div>
              <h3 className="text-2xl font-black text-slate-800 mt-2">投稿スケジュール</h3>
            </div>

            <div className="space-y-3">
              {post.schedulePack.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-black text-slate-800">{item.label}</div>
                    <div className="text-sm text-slate-500">{item.time} / {item.outputTitle}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {history.length > 0 && (
        <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
          <div className="p-8 md:p-10 space-y-6">
            <div>
              <div className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">History</div>
              <h3 className="text-2xl font-black text-slate-800 mt-2">生成履歴</h3>
            </div>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={`${item.timestamp ?? 'time'}-${index}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="text-sm font-black text-slate-800 break-all">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        {item.theme || 'テーマ未設定'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString('ja-JP') : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectHistory?.(item)}
                        className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-sm"
                      >
                        表示する
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteHistory?.(item, index)}
                        className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center"
                        aria-label="履歴を削除"
                        title="履歴を削除"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
