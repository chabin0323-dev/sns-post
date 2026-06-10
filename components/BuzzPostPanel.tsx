// components/BuzzPostPanel.tsx
// 追加出力項目・出力トグル・全選択デフォルト対応版

import React, { useState } from 'react';
import type { BuzzPostResult } from '../types';

interface BuzzPostPanelProps {
  onGenerate: (articleText: string, length: 300 | 500 | 600, profileCta: string, postUrl: string, tiktokCta: string) => void;
  result: BuzzPostResult | null;
  isLoading: boolean;
}

// 出力項目定義
type BuzzOutputKey =
  | 'tiktokArticle' | 'hashtags' | 'seoTitle' | 'seoKeywords'
  | 'metaDescription' | 'articleTitle' | 'thumbnailTitle'
  | 'threadsPost' | 'xPost' | 'instagramPost' | 'youtubePost'
  | 'noteArticle' | 'score' | 'improvement'
  | 'profileCtaText' | 'postUrlText'
  | 'thumbnailTikTok' | 'thumbnailTikTokPerson' | 'thumbnailNote' | 'seoSpecialTitle';

const OUTPUT_LABELS: Record<BuzzOutputKey, string> = {
  tiktokArticle:   '🎬 TikTok・YouTube Shorts・Instagram共用記事',
  hashtags:        '# ハッシュタグ',
  threadsPost:     '💬 Threads投稿文',
  xPost:           '✖️ X投稿文',
  instagramPost:   '📸 Instagram投稿文',
  youtubePost:     '▶️ YouTube Shorts',
  noteArticle:     '📝 note記事',
  profileCtaText:  '👤 プロフィール誘導文',
  postUrlText:     '🔗 投稿URL',
  thumbnailTikTok: '🎨 TikTok画像生成指示文',
  thumbnailTikTokPerson: '👤 TikTok人物画像生成指示文',
  thumbnailNote:   '📝 note画像生成指示文',
  seoSpecialTitle: '🔍 SEO特化タイトル',
  seoTitle:        '🔍 SEOタイトル',
  seoKeywords:     '🏷️ SEOキーワード',
  metaDescription: '📄 メタディスクリプション',
  articleTitle:    '📰 記事タイトル',
  thumbnailTitle:  '🖼️ サムネイル用タイトル',
  score:           '⚡ BAZZ SCORE',
  improvement:     '💡 改善提案',
};

const ALL_KEYS: BuzzOutputKey[] = [
  'tiktokArticle', 'hashtags', 'threadsPost', 'xPost', 'instagramPost', 'youtubePost',
  'noteArticle',
  'profileCtaText', 'postUrlText',
  'thumbnailTikTok', 'thumbnailTikTokPerson', 'thumbnailNote',
  'seoSpecialTitle', 'seoTitle', 'seoKeywords', 'metaDescription', 'articleTitle', 'thumbnailTitle',
  'score', 'improvement',
];

// コピーボタン
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button onClick={handleCopy} style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
      fontWeight: 'bold', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
      backgroundColor: copied ? '#D1FAE5' : '#fff',
      borderColor: copied ? '#6EE7B7' : '#e5e7eb',
      color: copied ? '#065F46' : '#6b7280',
    }}>
      {copied ? '✅ コピー済み' : '📋 コピー'}
    </button>
  );
}

// スコアバー
function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 85 ? '#10B981' : value >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color }}>{value}</span>
      </div>
      <div style={{ height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, backgroundColor: color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// 出力カード
function OutputCard({ label, children, copyText, style: extraStyle }: {
  label: string; children: React.ReactNode; copyText?: string;
  style?: React.CSSProperties;
}) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff', borderRadius: '16px', padding: '16px',
    marginBottom: '12px', border: '1px solid #fce7f3',
    boxShadow: '0 2px 8px rgba(212,83,126,0.06)', ...extraStyle,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: '800', color: '#72243E',
    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
  };
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={labelStyle}>{label}</div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </div>
  );
}

const BUZZ_SETTINGS_KEY = 'buzz_post_settings_v1';
const BUZZ_KEYS_STORAGE_KEY = 'buzz_output_keys_v1';
const BUZZ_ARTICLE_KEY = 'buzz_article_text_v1';
const BUZZ_LENGTH_KEY = 'buzz_tiktok_length_v1';
const BUZZ_TIKTOK_CTA_KEY = 'buzz_tiktok_cta_v1';

// TikTok専用誘導文の雛型テンプレート
const TIKTOK_CTA_TEMPLATES = [
  '❤️ 気になる方は
プロフィールのリンクから',
  '❤️ 続きが気になる方は
プロフィールのリンクから',
  '❤️ もっと詳しく知りたい方は
プロフィールのリンクから',
  '❤️ 共感した方は
プロフィールのリンクから',
  '❤️ 保存してゆっくり読んでね
プロフィールのリンクから',
];

export const BuzzPostPanel: React.FC<BuzzPostPanelProps> = ({
  onGenerate,
  result,
  isLoading,
}) => {
  const [articleText, setArticleText] = useState('');
  const [tiktokLength, setTiktokLength] = useState<300 | 500 | 600>(300);
  const [enabledKeys, setEnabledKeys] = useState<BuzzOutputKey[]>([...ALL_KEYS]);
  // 独自のprofileCta・postUrl入力欄（localStorage保存）
  const [profileCta, setProfileCta] = useState('');
  const [postUrl, setPostUrl] = useState('');
  // TikTok専用誘導文
  const [tiktokCtaTemplate, setTiktokCtaTemplate] = useState(TIKTOK_CTA_TEMPLATES[0]);
  const [tiktokCtaExtra, setTiktokCtaExtra] = useState('');
  const [tiktokCtaSaved, setTiktokCtaSaved] = useState(false);

  // プロフィール誘導文・URLを入力のたびに自動保存
  const handleProfileCtaChange = (val: string) => {
    setProfileCta(val);
    try {
      const current = JSON.parse(localStorage.getItem(BUZZ_SETTINGS_KEY) || '{}');
      localStorage.setItem(BUZZ_SETTINGS_KEY, JSON.stringify({ ...current, profileCta: val }));
    } catch {}
  };
  const handlePostUrlChange = (val: string) => {
    setPostUrl(val);
    try {
      const current = JSON.parse(localStorage.getItem(BUZZ_SETTINGS_KEY) || '{}');
      localStorage.setItem(BUZZ_SETTINGS_KEY, JSON.stringify({ ...current, postUrl: val }));
    } catch {}
  };
  const [savedMsg, setSavedMsg] = useState(false);

  // 起動時にlocalStorageから復元
  React.useEffect(() => {
    try {
      // プロフィール誘導文・URL復元
      const saved = localStorage.getItem(BUZZ_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profileCta) setProfileCta(parsed.profileCta);
        if (parsed.postUrl) setPostUrl(parsed.postUrl);
      }
      // 出力項目選択状態復元（初回のみ全選択・2回目以降は保存状態）
      const savedKeys = localStorage.getItem(BUZZ_KEYS_STORAGE_KEY);
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys) as BuzzOutputKey[];
        if (Array.isArray(parsedKeys) && parsedKeys.length > 0) {
          setEnabledKeys(parsedKeys);
        }
      }
      // TikTok専用誘導文復元
      const savedTiktokCta = localStorage.getItem(BUZZ_TIKTOK_CTA_KEY);
      if (savedTiktokCta) {
        try {
          const parsed = JSON.parse(savedTiktokCta);
          if (parsed.template) setTiktokCtaTemplate(parsed.template);
          if (parsed.extra) setTiktokCtaExtra(parsed.extra);
        } catch {}
      }
      // 記事本文復元
      const savedArticle = localStorage.getItem(BUZZ_ARTICLE_KEY);
      if (savedArticle) setArticleText(savedArticle);
      // 文字数設定復元
      const savedLength = localStorage.getItem(BUZZ_LENGTH_KEY);
      if (savedLength) {
        const len = Number(savedLength) as 300 | 500 | 600;
        if ([300, 500, 600].includes(len)) setTiktokLength(len);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(BUZZ_SETTINGS_KEY, JSON.stringify({ profileCta, postUrl }));
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    } catch {}
  };

  const handleTiktokCtaSave = () => {
    try {
      localStorage.setItem(BUZZ_TIKTOK_CTA_KEY, JSON.stringify({ template: tiktokCtaTemplate, extra: tiktokCtaExtra }));
      setTiktokCtaSaved(true);
      setTimeout(() => setTiktokCtaSaved(false), 2000);
    } catch {}
  };

  // TikTok最終誘導文を組み立て
  const buildTiktokCta = (): string => {
    const parts = [tiktokCtaTemplate, tiktokCtaExtra].filter(Boolean);
    return parts.join('
');
  };

  const toggleKey = (key: BuzzOutputKey) => {
    setEnabledKeys(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      // 変更のたびに自動保存
      try { localStorage.setItem(BUZZ_KEYS_STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // 全選択ボタン押下時も保存
  const handleSelectAll = () => {
    const all = [...ALL_KEYS];
    setEnabledKeys(all);
    try { localStorage.setItem(BUZZ_KEYS_STORAGE_KEY, JSON.stringify(all)); } catch {}
  };

  // 全解除ボタン押下時も保存
  const handleClearAll = () => {
    setEnabledKeys([]);
    try { localStorage.setItem(BUZZ_KEYS_STORAGE_KEY, JSON.stringify([])); } catch {}
  };

  const handleClick = () => {
    if (!articleText.trim()) return;
    onGenerate(articleText, tiktokLength, profileCta, postUrl, buildTiktokCta());
  };

  const isEnabled = (key: BuzzOutputKey) => enabledKeys.includes(key);

  const preStyle: React.CSSProperties = {
    fontSize: '13px', lineHeight: '1.8', margin: 0,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    color: '#374151', fontFamily: 'inherit',
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px', border: '2px solid #fce7f3', boxShadow: '0 4px 20px rgba(212,83,126,0.08)' }}>

      {/* タイトル */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#72243E', margin: 0 }}>✍️ バズる投稿生成</h3>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>作成済みの記事をそのまま貼り付けてください</p>
      </div>

      {/* 記事貼り付けエリア */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #fce7f3' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#72243E', marginBottom: '8px' }}>📄 記事本文を貼り付け</div>
        <textarea
          value={articleText}
          onChange={e => {
          setArticleText(e.target.value);
          try { localStorage.setItem(BUZZ_ARTICLE_KEY, e.target.value); } catch {}
        }}
          placeholder={"作成済みの記事・台本をここに貼り付けてください\n\n例）\n片思いって、本当に消耗するよね。\n好きな人のことを考えるだけで...\n\n※記事本文は変更・削除・要約しません"}
          rows={8}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            border: '1px solid #fce7f3', fontSize: '13px', lineHeight: '1.7',
            resize: 'vertical', outline: 'none', fontFamily: 'inherit',
            color: '#374151', backgroundColor: '#fffafa', boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: '6px', textAlign: 'right', fontSize: '11px', color: '#9ca3af' }}>
          {articleText.replace(/\n/g, '').length}文字（改行除外）／ 設定：{tiktokLength}字
        </div>
      </div>

      {/* 文字数選択 */}
      <div style={{ backgroundColor: '#fdf2f8', borderRadius: '16px', padding: '12px', marginBottom: '12px', border: '1px solid #fce7f3' }}>
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '8px' }}>📏 投稿文字数を選択</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {([300, 500, 600] as (300 | 500 | 600)[]).map(len => (
            <button key={len} onClick={() => {
              setTiktokLength(len);
              try { localStorage.setItem(BUZZ_LENGTH_KEY, String(len)); } catch {}
            }} style={{
              flex: 1, padding: '8px 0', borderRadius: '10px', border: '2px solid',
              fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
              backgroundColor: tiktokLength === len ? '#FFE0EC' : '#fff',
              borderColor: tiktokLength === len ? '#D4537E' : '#e5e7eb',
              color: tiktokLength === len ? '#72243E' : '#6b7280',
            }}>
              {len}字
            </button>
          ))}
        </div>
      </div>

      {/* プロフィール誘導文・投稿URL入力 */}
      <div style={{ backgroundColor: '#fdf2f8', borderRadius: '16px', padding: '14px', marginBottom: '12px', border: '1px solid #fce7f3' }}>
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '10px' }}>⚙️ 設定（保存するとアプリ再起動後も保持）</div>

        {/* プロフィール誘導文 */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#72243E', marginBottom: '4px' }}>👤 プロフィール誘導文</div>
          <input
            type="text"
            value={profileCta}
            onChange={e => handleProfileCtaChange(e.target.value)}
            placeholder="例）プロフのリンクから詳細を確認してね💕"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              border: '1px solid #fce7f3', fontSize: '13px', outline: 'none',
              fontFamily: 'inherit', color: '#374151', backgroundColor: '#fffafa',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 投稿URL */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#72243E', marginBottom: '4px' }}>🔗 投稿URL</div>
          <input
            type="text"
            value={postUrl}
            onChange={e => handlePostUrlChange(e.target.value)}
            placeholder="例）https://note.com/yourname/n/xxxxx"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              border: '1px solid #fce7f3', fontSize: '13px', outline: 'none',
              fontFamily: 'inherit', color: '#374151', backgroundColor: '#fffafa',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* TikTok専用誘導文設定 */}
        <div style={{ borderTop: '1px solid #fce7f3', paddingTop: '10px', marginTop: '4px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#72243E', marginBottom: '6px' }}>
            🎬 TikTok専用誘導文（他SNSには反映されません）
          </div>
          {/* 雛型選択 */}
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>雛型を選択</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
            {TIKTOK_CTA_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => setTiktokCtaTemplate(tmpl)}
                style={{
                  padding: '8px 10px', borderRadius: '10px', border: '1px solid',
                  fontSize: '12px', cursor: 'pointer', textAlign: 'left', lineHeight: '1.5',
                  backgroundColor: tiktokCtaTemplate === tmpl ? '#FFE0EC' : '#fff',
                  borderColor: tiktokCtaTemplate === tmpl ? '#D4537E' : '#e5e7eb',
                  color: tiktokCtaTemplate === tmpl ? '#72243E' : '#6b7280',
                  fontWeight: tiktokCtaTemplate === tmpl ? '700' : '400',
                }}
              >
                {tmpl}
              </button>
            ))}
          </div>
          {/* TikTok追加誘導文 */}
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>TikTok追加誘導文（自由入力）</div>
          <textarea
            value={tiktokCtaExtra}
            onChange={e => setTiktokCtaExtra(e.target.value)}
            placeholder={'例）彼の本音が知りたい方は
プロフィールのリンクから'}
            rows={2}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: '10px',
              border: '1px solid #fce7f3', fontSize: '12px', lineHeight: '1.6',
              outline: 'none', fontFamily: 'inherit', color: '#374151',
              backgroundColor: '#fffafa', boxSizing: 'border-box', resize: 'none',
            }}
          />
          <button
            onClick={handleTiktokCtaSave}
            style={{
              marginTop: '6px', padding: '6px 16px', borderRadius: '10px', border: 'none',
              fontSize: '12px', fontWeight: '800', cursor: 'pointer',
              backgroundColor: tiktokCtaSaved ? '#D1FAE5' : '#FFE0EC',
              color: tiktokCtaSaved ? '#065F46' : '#72243E',
              transition: 'all 0.2s',
            }}
          >
            {tiktokCtaSaved ? '✅ 保存しました' : '💾 TikTok誘導文を保存'}
          </button>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          style={{
            padding: '8px 20px', borderRadius: '10px', border: 'none',
            fontSize: '12px', fontWeight: '800', cursor: 'pointer',
            backgroundColor: savedMsg ? '#D1FAE5' : '#FFE0EC',
            color: savedMsg ? '#065F46' : '#72243E',
            transition: 'all 0.2s',
          }}
        >
          {savedMsg ? '✅ 保存しました' : '💾 設定を保存'}
        </button>
      </div>

      {/* 出力項目トグル */}
      <div style={{ backgroundColor: '#fdf2f8', borderRadius: '16px', padding: '12px', marginBottom: '12px', border: '1px solid #fce7f3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>📋 出力する項目を選択（初期：全選択）</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleSelectAll} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', border: '1px solid #D4537E', backgroundColor: '#FFE0EC', color: '#72243E', cursor: 'pointer', fontWeight: '700' }}>全選択</button>
            <button onClick={handleClearAll} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#6b7280', cursor: 'pointer', fontWeight: '700' }}>全解除</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {ALL_KEYS.map(key => (
            <button key={key} onClick={() => toggleKey(key)} style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '20px',
              border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', fontWeight: '700',
              backgroundColor: isEnabled(key) ? '#FFE0EC' : '#f9fafb',
              borderColor: isEnabled(key) ? '#D4537E' : '#e5e7eb',
              color: isEnabled(key) ? '#72243E' : '#9ca3af',
            }}>
              {OUTPUT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* 生成ボタン */}
      <button
        onClick={handleClick}
        disabled={isLoading || !articleText.trim()}
        style={{
          width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
          fontSize: '15px', fontWeight: '900', letterSpacing: '0.5px', marginBottom: '20px',
          cursor: !articleText.trim() || isLoading ? 'not-allowed' : 'pointer',
          background: !articleText.trim() || isLoading
            ? '#ccc'
            : 'linear-gradient(135deg, #F472B6 0%, #D4537E 50%, #9333EA 100%)',
          color: '#fff',
          boxShadow: !articleText.trim() || isLoading ? 'none' : '0 4px 20px rgba(212,83,126,0.4)',
          transition: 'all 0.2s',
        }}
      >
        {isLoading ? '⟳ 分析・生成中...' : '🔥 バズる投稿を生成する'}
      </button>

      {/* 生成結果 */}
      {result && (
        <div>
          {/* 感情・投稿タイプバッジ */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#EDE9FE', color: '#5B21B6', padding: '4px 12px', borderRadius: '20px' }}>感情：{result.emotionType}</span>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FCE7F3', color: '#9D174D', padding: '4px 12px', borderRadius: '20px' }}>タイプ：{result.postType}</span>
          </div>

          {/* TikTok記事本文 */}
          {isEnabled('tiktokArticle') && (
            <OutputCard label="🎬 TikTok・YouTube Shorts・Instagram共用記事（20文字改行）" copyText={result.tiktokArticle}>
              <pre style={preStyle}>{result.tiktokArticle}</pre>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0' }}>
                改行除外文字数：{result.tiktokArticle.replace(/\n/g, '').length}字
              </p>
            </OutputCard>
          )}

          {/* ハッシュタグ */}
          {isEnabled('hashtags') && (
            <OutputCard label="# ハッシュタグ（TikTok / Instagram / Threads / X / YouTube対応）" copyText={result.hashtagText}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {result.hashtags.map((tag, i) => (
                  <span key={i} style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#EDE9FE', color: '#5B21B6', padding: '4px 10px', borderRadius: '20px' }}>{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>記事内容を分析して生成した動的ハッシュタグです</p>
            </OutputCard>
          )}

          {/* Threads投稿文 */}
          {isEnabled('threadsPost') && (
            <OutputCard label="💬 Threads投稿文" copyText={result.threadsPost}>
              <pre style={preStyle}>{result.threadsPost}</pre>
            </OutputCard>
          )}

          {/* X投稿文 */}
          {isEnabled('xPost') && (
            <OutputCard label="✖️ X投稿文" copyText={result.xPost}>
              <pre style={preStyle}>{result.xPost}</pre>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0' }}>※冒頭4行＋URL（140文字目安）</p>
            </OutputCard>
          )}

          {/* Instagram投稿文 */}
          {isEnabled('instagramPost') && (
            <OutputCard label="📸 Instagram投稿文" copyText={result.instagramPost}>
              <pre style={preStyle}>{result.instagramPost}</pre>
            </OutputCard>
          )}

          {/* YouTube Shorts */}
          {isEnabled('youtubePost') && (
            <OutputCard label="▶️ YouTube Shorts投稿文" copyText={result.youtubePost}>
              <pre style={preStyle}>{result.youtubePost}</pre>
            </OutputCard>
          )}

          {/* note記事 */}
          {isEnabled('noteArticle') && (
            <OutputCard label="📝 note記事" copyText={result.noteArticle}>
              <pre style={preStyle}>{result.noteArticle}</pre>
            </OutputCard>
          )}

          {/* プロフィール誘導文 */}
          {isEnabled('profileCtaText') && result.profileCtaText && (
            <OutputCard label="👤 プロフィール誘導文" copyText={result.profileCtaText}>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#374151', margin: 0 }}>{result.profileCtaText}</p>
            </OutputCard>
          )}

          {/* 投稿URL */}
          {isEnabled('postUrlText') && result.postUrlText && (
            <OutputCard label="🔗 投稿URL" copyText={result.postUrlText}>
              <p style={{ fontSize: '13px', color: '#2563eb', margin: 0, wordBreak: 'break-all' }}>{result.postUrlText}</p>
            </OutputCard>
          )}

          {/* TikTok画像生成指示文 */}
          {isEnabled('thumbnailTikTok') && (
            <OutputCard label="🎨 TikTok画像生成指示文（1080×1920）" copyText={result.thumbnailTikTok}>
              <pre style={preStyle}>{result.thumbnailTikTok}</pre>
            </OutputCard>
          )}

          {/* TikTok人物画像生成指示文 */}
          {isEnabled('thumbnailTikTokPerson') && (
            <OutputCard label="👤 TikTok人物画像生成指示文（CapCutテンプレート用）" copyText={result.thumbnailTikTokPerson}>
              <pre style={preStyle}>{result.thumbnailTikTokPerson}</pre>
            </OutputCard>
          )}

          {/* note画像生成指示文 */}
          {isEnabled('thumbnailNote') && (
            <OutputCard label="📝 note画像生成指示文（1280×670）" copyText={result.thumbnailNote}>
              <pre style={preStyle}>{result.thumbnailNote}</pre>
            </OutputCard>
          )}

          {/* SEO特化タイトル */}
          {isEnabled('seoSpecialTitle') && (
            <OutputCard label="🔍 SEO特化タイトル（検索流入・クリック率重視）" copyText={result.seoSpecialTitle}>
              <p style={{ fontSize: '15px', fontWeight: '900', color: '#1e40af', margin: 0 }}>{result.seoSpecialTitle}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>{result.seoSpecialTitle.length}文字（30〜40文字推奨）</p>
            </OutputCard>
          )}

          {/* SEOタイトル */}
          {isEnabled('seoTitle') && (
            <OutputCard label="🔍 SEOタイトル" copyText={result.seoTitle}>
              <p style={{ fontSize: '14px', fontWeight: '800', color: '#1e40af', margin: 0 }}>{result.seoTitle}</p>
            </OutputCard>
          )}

          {/* SEOキーワード */}
          {isEnabled('seoKeywords') && (
            <OutputCard label="🏷️ SEOキーワード" copyText={result.seoKeywords.join(', ')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.seoKeywords.map((kw, i) => (
                  <span key={i} style={{ fontSize: '12px', fontWeight: '700', backgroundColor: '#DBEAFE', color: '#1e40af', padding: '4px 10px', borderRadius: '20px' }}>{kw}</span>
                ))}
              </div>
            </OutputCard>
          )}

          {/* メタディスクリプション */}
          {isEnabled('metaDescription') && (
            <OutputCard label="📝 メタディスクリプション" copyText={result.metaDescription}>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0 }}>{result.metaDescription}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>{result.metaDescription.length}文字（120文字以内推奨）</p>
            </OutputCard>
          )}

          {/* 記事タイトル */}
          {isEnabled('articleTitle') && (
            <OutputCard label="📰 記事タイトル" copyText={result.articleTitle}>
              <p style={{ fontSize: '15px', fontWeight: '800', color: '#374151', margin: 0 }}>{result.articleTitle}</p>
            </OutputCard>
          )}

          {/* サムネイル用タイトル */}
          {isEnabled('thumbnailTitle') && (
            <OutputCard label="🖼️ サムネイル用タイトル" copyText={result.thumbnailTitle}>
              <p style={{ fontSize: '18px', fontWeight: '900', color: '#D4537E', margin: 0, letterSpacing: '1px' }}>{result.thumbnailTitle}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>短くインパクト重視（15文字以内）</p>
            </OutputCard>
          )}

          {/* BAZZ SCORE */}
          {isEnabled('score') && (
            <OutputCard label="⚡ BAZZ SCORE（推定）">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px', fontWeight: '900', color: result.score.total >= 85 ? '#10B981' : result.score.total >= 70 ? '#F59E0B' : '#EF4444' }}>
                  {result.score.total}<span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>/100</span>
                </span>
              </div>
              <ScoreBar label="共感力" value={result.score.empathy} />
              <ScoreBar label="保存率" value={result.score.saveRate} />
              <ScoreBar label="クリック率" value={result.score.clickRate} />
              <ScoreBar label="拡散率" value={result.score.spreadRate} />
              <ScoreBar label="コメント率" value={result.score.commentRate} />
              <ScoreBar label="プロフィール誘導力" value={result.score.profileRate} />
              <p style={{ fontSize: '10px', color: '#9ca3af', margin: '10px 0 0', textAlign: 'right' }}>※推定スコアです</p>
            </OutputCard>
          )}

          {/* 改善提案（95点未満のみ） */}
          {isEnabled('improvement') && result.improvement && (
            <OutputCard label="💡 改善提案" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'フック改善', text: result.improvement.hookSuggestion },
                  { label: '感情強化', text: result.improvement.emotionSuggestion },
                  { label: '保存率UP', text: result.improvement.saveSuggestion },
                  { label: 'クリック率UP', text: result.improvement.clickSuggestion },
                ].map(({ label, text }) => (
                  <div key={label} style={{ backgroundColor: '#fff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginRight: '6px' }}>{label}</span>
                    <span style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>{text}</span>
                  </div>
                ))}
              </div>
            </OutputCard>
          )}

          {/* 95点以上 */}
          {isEnabled('improvement') && !result.improvement && (
            <div style={{ backgroundColor: '#D1FAE5', borderRadius: '16px', padding: '16px', border: '1px solid #6EE7B7', textAlign: 'center', marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: '900', color: '#065F46', margin: 0 }}>🎉 スコア95点以上！このまま投稿GO!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
