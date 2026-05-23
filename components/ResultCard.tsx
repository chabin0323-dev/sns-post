import React, { useState } from 'react';
import type { GeneratedContent, OutputKey } from '../types';
import { OUTPUT_KEY_LABELS } from '../services/loveContentGenerator';

interface ResultCardProps {
  content: GeneratedContent;
  enabledKeys: OutputKey[];
}

const SECTION_COLORS: Record<OutputKey, string> = {
  mainContent: 'border-[#D4537E] bg-[#FFF0F5]',
  hashtags: 'border-pink-300 bg-pink-50',
  threads: 'border-purple-300 bg-purple-50',
  x: 'border-sky-300 bg-sky-50',
  note: 'border-emerald-300 bg-emerald-50',
  noteUrl: 'border-teal-300 bg-teal-50',
  seo: 'border-amber-300 bg-amber-50',
  thumbnail: 'border-orange-300 bg-orange-50',
};

const SECTION_ICONS: Record<OutputKey, string> = {
  mainContent: '🎬',
  hashtags: '#️⃣',
  threads: '🧵',
  x: '✕',
  note: '📝',
  noteUrl: '🔗',
  seo: '🔍',
  thumbnail: '🖼️',
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
      style={{
        backgroundColor: copied ? '#D4537E' : '#FFE0EC',
        color: copied ? 'white' : '#72243E',
      }}
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>コピー完了</span>
        </>
      ) : (
        <>
          <span>📋</span>
          <span>コピー</span>
        </>
      )}
    </button>
  );
};

const SectionBlock: React.FC<{
  outputKey: OutputKey;
  content: string;
}> = ({ outputKey, content }) => {
  if (!content) return null;

  return (
    <div className={`rounded-2xl border-2 p-4 space-y-3 ${SECTION_COLORS[outputKey]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{SECTION_ICONS[outputKey]}</span>
          <span className="text-sm font-black text-gray-800">{OUTPUT_KEY_LABELS[outputKey]}</span>
        </div>
        <CopyButton text={content} />
      </div>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words font-sans leading-relaxed bg-white/60 rounded-xl p-3">
        {content}
      </pre>
    </div>
  );
};

const BuzzMeter: React.FC<{ score: GeneratedContent['buzzScore'] }> = ({ score }) => {
  const bars = [
    { label: 'フック力', value: score.hookPower, max: 20, color: '#D4537E' },
    { label: '保存率', value: score.saveRate, max: 20, color: '#e879a0' },
    { label: 'コメント', value: score.commentRate, max: 20, color: '#c44070' },
    { label: 'プロフ誘導', value: score.profileRate, max: 20, color: '#b83268' },
    { label: 'SEO', value: score.seoScore, max: 20, color: '#a02660' },
  ];

  return (
    <div className="bg-[#FFF0F5] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black text-gray-800">バズ度スコア</span>
        <span className="text-2xl font-black" style={{ color: '#D4537E' }}>{score.total}<span className="text-sm">/100</span></span>
      </div>
      <p className="text-xs font-bold" style={{ color: '#D4537E' }}>{score.comment}</p>
      <div className="space-y-2">
        {bars.map(bar => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 w-16 shrink-0">{bar.label}</span>
            <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(bar.value / bar.max) * 100}%`, backgroundColor: bar.color }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{bar.value}/{bar.max}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ content, enabledKeys }) => {
  const getSeoText = () => {
    if (!content.seoSet.title) return '';
    return [
      `タイトル：${content.seoSet.title}`,
      `キーワード：${content.seoSet.keywords.join('、')}`,
      `description：${content.seoSet.description}`,
    ].join('\n');
  };

  const sections: { key: OutputKey; text: string }[] = [
    { key: 'mainContent', text: content.mainContent },
    { key: 'hashtags', text: content.hashtagText },
    { key: 'threads', text: content.threadsPost },
    { key: 'x', text: content.xPost },
    { key: 'note', text: content.noteArticle },
    { key: 'noteUrl', text: content.noteUrl },
    { key: 'seo', text: getSeoText() },
    { key: 'thumbnail', text: content.thumbnailPrompt },
  ];

  const visibleSections = sections.filter(s => enabledKeys.includes(s.key) && s.text);

  return (
    <div className="space-y-4">
      {/* ヘッダー情報 */}
      <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-2 items-center">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: '#FFE0EC', color: '#72243E' }}
        >
          {content.theme}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: '#FFE0EC', color: '#72243E' }}
        >
          {content.hookType}
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {new Date(content.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}生成
        </span>
      </div>

      {/* バズ度スコア */}
      <BuzzMeter score={content.buzzScore} />

      {/* 各セクション */}
      {visibleSections.map(section => (
        <SectionBlock
          key={section.key}
          outputKey={section.key}
          content={section.text}
        />
      ))}

      {visibleSections.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-8">
          出力する項目を選択してください
        </div>
      )}
    </div>
  );
};
