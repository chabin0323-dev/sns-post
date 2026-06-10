import React, { useState } from 'react';
import type { GeneratedContent, OutputKey } from '../types';

interface Props {
  content: GeneratedContent;
  enabledKeys: OutputKey[];
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-white"
      style={{ background: copied ? '#10B981' : '#6B7280' }}>
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
      <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

const Section: React.FC<{ label: string; emoji: string; color: string; children: React.ReactNode; copyText: string }> = ({ label, emoji, color, children, copyText }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3" style={{ background: `${color}15`, borderBottom: `2px solid ${color}30` }}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="font-bold text-sm text-gray-800">{label}</span>
      </div>
      <CopyButton text={copyText} />
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

function generateImagePrompt(content: GeneratedContent): string {
  const { genre, theme, mainContent } = content;
  const firstLine = mainContent.split('\n')[0] ?? theme;
  let styleGuide = '';
  let emotionGuide = '';
  let subjectGuide = '';
  if (genre === '恋愛') {
    styleGuide = 'warm romantic atmosphere, soft pink and purple bokeh background, intimate and emotional mood';
    emotionGuide = 'expressive longing or heartfelt emotion on face, slightly teary or deeply in love eyes';
    subjectGuide = 'young Japanese woman in her 20s-30s, holding smartphone, looking thoughtful or emotional';
  } else if (genre === '美容・ダイエット') {
    styleGuide = 'clean bright beauty studio background, high-end cosmetic aesthetic, soft natural lighting';
    emotionGuide = 'confident glowing expression, fresh and radiant skin, clean beauty look';
    subjectGuide = 'beautiful Japanese woman in her 20s-30s, flawless skin, minimal makeup or beauty product in hand';
  } else if (genre === 'ビジネス・起業' || genre === '転職・キャリア' || genre === '副業・稼ぐ') {
    styleGuide = 'modern office or city background, professional and trustworthy atmosphere, cool tones';
    emotionGuide = 'confident determined expression, strong eye contact, professional composure';
    subjectGuide = 'Japanese professional man or woman in their 30s, business casual attire, holding laptop or documents';
  } else if (genre === 'お金・資産') {
    styleGuide = 'sleek financial aesthetic, dark premium background with gold accents, luxury atmosphere';
    emotionGuide = 'motivated and focused expression, sense of achievement and ambition';
    subjectGuide = 'Japanese man or woman in their 30s, smart casual outfit, looking aspirational and driven';
  } else if (genre === '健康・メンタル') {
    styleGuide = 'calm natural background, soft green tones, peaceful and healing atmosphere';
    emotionGuide = 'serene relieved expression, calm and clear eyes, sense of inner peace';
    subjectGuide = 'Japanese person in their 20s-40s, casual comfortable clothing, relaxed posture';
  } else if (genre === '育児・子育て') {
    styleGuide = 'warm cozy home background, soft pastel tones, heartwarming family atmosphere';
    emotionGuide = 'warm loving expression, gentle smile, nurturing and caring look';
    subjectGuide = 'Japanese mother or father in their 30s, casual homewear, caring gesture';
  } else {
    styleGuide = 'clean modern Japanese lifestyle background, bright and inviting atmosphere';
    emotionGuide = 'engaged expressive face, relatable and approachable emotion';
    subjectGuide = 'Japanese man or woman in their 20s-30s, casual everyday outfit';
  }
  return `[画像生成プロンプト - TikTokサムネイル専用]

Vertical 9:16 ratio, 1080x1920px, ultra-high quality photorealistic image.

Subject: ${subjectGuide}.
Expression & Emotion: ${emotionGuide}.
Style & Background: ${styleGuide}.
Composition: close-up to mid-shot, subject positioned slightly off-center, strong visual hierarchy for text overlay.
Text overlay area: leave upper 20% and lower 20% of image clear for Japanese text.
Main text to overlay (top area): 「${firstLine}」
Lighting: cinematic soft lighting, slight rim light on subject.
Quality: 8K resolution, sharp focus on face, shallow depth of field background blur, professional photography style.
Mood: emotionally engaging, high click-through rate TikTok thumbnail aesthetic.
Japanese people only. Realistic, not illustrated or anime style.`;
}

export const ResultCard: React.FC<Props> = ({ content, enabledKeys }) => {
  const { buzzScore } = content;
  const seoText = `【SEOタイトル】\n${content.seoSet.title}\n\n【キーワード】\n${content.seoSet.keywords.join('、')}\n\n【メタディスクリプション】\n${content.seoSet.description}`;
  const imagePrompt = generateImagePrompt(content);

  // ハッシュタグの#重複を防ぐ（loveContentGeneratorが#付きで返すため）
  const cleanTag = (tag: string) => tag.startsWith('#') ? tag : `#${tag}`;
  const hashtagCopyText = content.hashtags.map(cleanTag).join(' ');

  return (
    <div className="space-y-4">

      {/* バズスコア */}
      <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #F472B6, #7C3AED)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold text-pink-100 uppercase tracking-wider">BUZZ SCORE 2026</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-5xl font-black">{buzzScore.total}</span>
              <span className="text-lg text-pink-100 mb-1">/100</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{buzzScore.total >= 85 ? '🔥' : buzzScore.total >= 75 ? '⚡' : '✨'}</div>
            <p className="text-xs text-pink-100">{content.genre} × {content.hookType}</p>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <BuzzMeter value={buzzScore.hookPower} label="🎣 フック力" color="#FDE68A" />
          <BuzzMeter value={buzzScore.saveRate} label="📌 保存率" color="#A7F3D0" />
          <BuzzMeter value={buzzScore.commentRate} label="💬 コメント率" color="#BFDBFE" />
          <BuzzMeter value={buzzScore.profileRate} label="👤 プロフィール遷移" color="#FBCFE8" />
          <BuzzMeter value={buzzScore.seoScore} label="🔍 SEOスコア" color="#FED7AA" />
        </div>
        <div className="mt-4 bg-white/20 rounded-xl px-4 py-2.5 text-sm font-bold text-center">{buzzScore.comment}</div>
        <div className="mt-3 text-xs text-pink-100 text-right">{content.theme} / {content.timestamp}</div>
      </div>

      {/* TikTok台本 */}
      {enabledKeys.includes('mainContent') && (
        <Section label="TikTok台本" emoji="🎬" color="#EC4899" copyText={content.mainContent}>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.mainContent}</pre>
        </Section>
      )}

      {/* 次回バズ候補タイトル */}
      {content.nextTitles && content.nextTitles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#FFF7ED', borderBottom: '2px solid #FED7AA' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-sm text-gray-800">次回バズ候補タイトル</span>
            </div>
            <CopyButton text={content.nextTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')} />
          </div>
          <div className="px-5 py-4 space-y-2">
            {content.nextTitles.map((title, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#FFF7ED' }}>
                <span className="text-xs font-black text-orange-400 mt-0.5 flex-shrink-0">#{i + 1}</span>
                <span className="text-sm font-bold text-gray-700 leading-relaxed">{title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ハッシュタグ */}
      {enabledKeys.includes('hashtags') && (
        <Section label="ハッシュタグ" emoji="#️⃣" color="#8B5CF6" copyText={hashtagCopyText}>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#8B5CF6' }}>
                {cleanTag(tag)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Threads */}
      {enabledKeys.includes('threads') && (
        <Section label="Threads投稿" emoji="🧵" color="#000000" copyText={content.threadsPost}>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.threadsPost}</pre>
        </Section>
      )}

      {/* X */}
      {enabledKeys.includes('x') && (
        <Section label="X(Twitter)投稿" emoji="𝕏" color="#1D9BF0" copyText={content.xPost}>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.xPost}</pre>
        </Section>
      )}

      {/* note記事 */}
      {enabledKeys.includes('note') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#41C9A015', borderBottom: '2px solid #41C9A030' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span className="font-bold text-sm text-gray-800">note記事</span>
            </div>
            <CopyButton text={content.noteArticle} />
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs font-bold text-green-700 mb-1.5">🔗 noteのURL（投稿後に入力すると他SNSに自動反映）</p>
              <input
                type="text"
                placeholder="https://note.com/..."
                defaultValue={content.noteUrl}
                className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                onChange={e => { (content as GeneratedContent).noteUrl = e.target.value; }}
              />
            </div>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.noteArticle}</pre>
          </div>
        </div>
      )}

      {/* SEO対策 */}
      {enabledKeys.includes('seo') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#F59E0B15', borderBottom: '2px solid #F59E0B30' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <span className="font-bold text-sm text-gray-800">SEO対策セット</span>
            </div>
            <CopyButton text={seoText} />
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 space-y-1 leading-relaxed">
              <p className="font-black text-sm mb-2">📖 SEO対策セットの使い方</p>
              <p>① <span className="font-bold">SEOタイトル</span> → note・ブログ記事のタイトルにそのまま使用</p>
              <p>② <span className="font-bold">キーワード</span> → 記事本文に自然に盛り込む。見出しや冒頭100文字以内に入れると効果的</p>
              <p>③ <span className="font-bold">メタディスクリプション</span> → noteの「つぶやき欄」や記事冒頭に使用。SNSシェア時の説明文になります</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">SEOタイトル</p>
              <p className="text-sm font-bold text-gray-800">{content.seoSet.title}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">キーワード</p>
              <div className="flex flex-wrap gap-1.5">
                {content.seoSet.keywords.map(kw => (
                  <span key={kw} className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">{kw}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">メタディスクリプション</p>
              <p className="text-sm text-gray-600 leading-relaxed">{content.seoSet.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* TikTokサムネイル */}
      {enabledKeys.includes('thumbnailTikTok') && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3" style={{ background: '#EC489915', borderBottom: '2px solid #EC489930' }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span className="font-bold text-sm text-gray-800">TikTokサムネイル（縦型 1080×1920）</span>
            </div>
            <CopyButton text={content.thumbnailTikTok} />
          </div>
          <div className="px-5 py-4 space-y-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.thumbnailTikTok}</pre>
            <div className="bg-pink-50 rounded-xl border border-pink-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#EC489920', borderBottom: '1px solid #EC489930' }}>
                <div className="flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <span className="font-bold text-xs text-gray-800">画像生成プロンプト（Midjourney / DALL-E 等）</span>
                </div>
                <CopyButton text={imagePrompt} />
              </div>
              <div className="px-4 py-3">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">{imagePrompt}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* noteサムネイル */}
      {enabledKeys.includes('thumbnailNote') && (
        <Section label="noteサムネイル（横型 1280×670）" emoji="🖼️" color="#41C9A0" copyText={content.thumbnailNote}>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{content.thumbnailNote}</pre>
        </Section>
      )}

      {/* 全コピー */}
      <button
        onClick={async () => {
          const parts = [];
          if (enabledKeys.includes('mainContent')) parts.push(`【TikTok台本】\n${content.mainContent}`);
          if (enabledKeys.includes('hashtags'))    parts.push(`【ハッシュタグ】\n${hashtagCopyText}`);
          if (enabledKeys.includes('threads'))     parts.push(`【Threads投稿】\n${content.threadsPost}`);
          if (enabledKeys.includes('x'))           parts.push(`【X投稿】\n${content.xPost}`);
          if (enabledKeys.includes('note'))        parts.push(`【note記事】\n${content.noteArticle}`);
          if (enabledKeys.includes('seo'))         parts.push(`【SEO対策】\n${seoText}`);
          if (enabledKeys.includes('thumbnailTikTok')) parts.push(`【TikTokサムネイル】\n${content.thumbnailTikTok}`);
          if (enabledKeys.includes('thumbnailNote'))   parts.push(`【noteサムネイル】\n${content.thumbnailNote}`);
          await navigator.clipboard.writeText(parts.join('\n\n' + '─'.repeat(30) + '\n\n'));
          alert('✅ 全コンテンツをコピーしました！');
        }}
        className="w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide shadow-md"
        style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
        📋 全コンテンツを一括コピー
      </button>
    </div>
  );
};
