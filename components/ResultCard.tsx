import React, { useState } from 'react';
import type { GeneratedContent, OutputKey } from '../types';

interface Props {
  content: GeneratedContent;
  enabledKeys: OutputKey[];
}

const SECTION_CONFIG: Record<OutputKey, { label: string; emoji: string; color: string }> = {
  mainContent: { label: 'TikTok台本', emoji: '🎬', color: '#EC4899' },
  hashtags: { label: 'ハッシュタグ', emoji: '#️⃣', color: '#8B5CF6' },
  threads: { label: 'Threads投稿', emoji: '🧵', color: '#000000' },
  x: { label: 'X(Twitter)投稿', emoji: '𝕏', color: '#1D9BF0' },
  note: { label: 'note記事', emoji: '📝', color: '#41C9A0' },
  seo: { label: 'SEO対策セット', emoji: '🔍', color: '#F59E0B' },
  thumbnail: { label: 'サムネイル案', emoji: '🖼️', color: '#EF4444' },
};

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-white"
      style={{ background: copied ? '#10B981' : '#6B7280' }}
    >
      {copied ? '✓ コピー済み' : 'コピー'}
    </button>
  );
};

const BuzzMeter: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-gray-500">
      <span>{label}</span>
      <span className="font-bold" style={{ color }}>{value}</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-1000"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  </div>
);

export const ResultCard: React.FC<Props> = ({ content, enabledKeys }) => {
  const { buzzScore } = content;

  const seoText = `【SEOタイトル】\n${content.seoSet.title}\n\n【キーワード】\n${content.seoSet.keywords.join('、')}\n\n【メタディスクリプション】\n${content.seoSet.description}`;

  const getContent = (key: OutputKey): string => {
    switch (key) {
      case 'mainContent': return content.mainContent;
      case 'hashtags': return content.hashtagText;
      case 'threads': return content.threadsPost;
      case 'x': return content.xPost;
      case 'note': return content.noteArticle;
      case 'seo': return seoText;
      case 'thumbnail': return content.thumbnailPrompt;
    }
  };

  return (
    <div className="space-y-4">

      {/* バズスコアカード */}
      <div
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #F472B6, #7C3AED)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-pink-100 uppercase tracking-wider">BUZZ SCORE 2026</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-5xl font-black">{buzzScore.total}</span>
              <span className="text-lg text-pink-100 mb-1">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">
              {buzzScore.total >= 85 ? '🔥' : buzzScore.total >= 75 ? '⚡' : buzzScore.total >= 65 ? '✨' : '💡'}
            </div>
            <p className="text-xs text-pink-100">
              {content.genre} × {content.hookType}
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <BuzzMeter value={buzzScore.hookPower} label="🎣 フック力" color="#FDE68A" />
          <BuzzMeter value={buzzScore.saveRate} label="📌 保存率" color="#A7F3D0" />
          <BuzzMeter value={buzzScore.commentRate} label="💬 コメント率" color="#BFDBFE" />
          <BuzzMeter value={buzzScore.profileRate} label="👤 プロフィール遷移" color="#FBCFE8" />
          <BuzzMeter value={buzzScore.seoScore} label="🔍 SEOスコア" color="#FED7AA" />
        </div>

        <div className="mt-4 bg-white/20 rounded-xl px-4 py-2.5 text-sm font-bold text-center">
          {buzzScore.comment}
        </div>

        <div className="mt-3 text-xs text-pink-100 text-right">
          {content.theme} / {content.timestamp}
        </div>
      </div>

      {/* 各出力セクション */}
      {(Object.keys(SECTION_CONFIG) as OutputKey[])
        .filter(key => enabledKeys.includes(key))
        .map(key => {
          const cfg = SECTION_CONFIG[key];
          const text = getContent(key);

          return (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* ヘッダー */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: `${cfg.color}15`, borderBottom: `2px solid ${cfg.color}30` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cfg.emoji}</span>
                  <span className="font-bold text-sm text-gray-800">{cfg.label}</span>
                </div>
                <CopyButton text={text} />
              </div>

              {/* コンテンツ */}
              <div className="px-5 py-4">
                {key === 'hashtags' ? (
                  <div className="flex flex-wrap gap-2">
                    {content.hashtags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: cfg.color }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : key === 'seo' ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">SEOタイトル</p>
                      <p className="text-sm font-bold text-gray-800">{content.seoSet.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">キーワード</p>
                      <div className="flex flex-wrap gap-1.5">
                        {content.seoSet.keywords.map(kw => (
                          <span key={kw} className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">メタディスクリプション</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{content.seoSet.description}</p>
                    </div>
                  </div>
                ) : (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                    {text}
                  </pre>
                )}
              </div>
            </div>
          );
        })}

      {/* 全コピーボタン */}
      <button
        onClick={async () => {
          const allText = (Object.keys(SECTION_CONFIG) as OutputKey[])
            .filter(k => enabledKeys.includes(k))
            .map(k => `【${SECTION_CONFIG[k].label}】\n${getContent(k)}`)
            .join('\n\n' + '─'.repeat(30) + '\n\n');
          await navigator.clipboard.writeText(allText);
          alert('✅ 全コンテンツをコピーしました！');
        }}
        className="w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide shadow-md"
        style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
      >
        📋 全コンテンツを一括コピー
      </button>
    </div>
  );
};
