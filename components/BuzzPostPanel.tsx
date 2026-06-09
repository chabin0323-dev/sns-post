// components/BuzzPostPanel.tsx
// 新規コンポーネント。既存コンポーネントへの変更はありません。

import React, { useState } from 'react';
import type { BuzzPostResult } from '../types';

interface BuzzPostPanelProps {
  tiktokLength: 300 | 500 | 600;
  profileCta: string;
  postUrl: string;
  onGenerate: (articleText: string) => void;
  result: BuzzPostResult | null;
  isLoading: boolean;
}

// コピーボタン（ResultCardと同じ方式）
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        border: '1px solid',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: copied ? '#D1FAE5' : '#fff',
        borderColor: copied ? '#6EE7B7' : '#e5e7eb',
        color: copied ? '#065F46' : '#6b7280',
      }}
    >
      {copied ? '✅ コピー済み' : '📋 コピー'}
    </button>
  );
}

// スコアバー
function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 85 ? '#10B981' :
    value >= 70 ? '#F59E0B' :
    '#EF4444';
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color }}>{value}</span>
      </div>
      <div style={{ height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

export const BuzzPostPanel: React.FC<BuzzPostPanelProps> = ({
  tiktokLength,
  profileCta,
  postUrl,
  onGenerate,
  result,
  isLoading,
}) => {
  const [articleText, setArticleText] = useState('');

  const handleClick = () => {
    if (!articleText.trim()) return;
    onGenerate(articleText);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #fce7f3',
    boxShadow: '0 2px 8px rgba(212,83,126,0.06)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '800',
    color: '#72243E',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '20px', border: '2px solid #fce7f3', boxShadow: '0 4px 20px rgba(212,83,126,0.08)' }}>

      {/* セクションタイトル */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#72243E', margin: 0 }}>
          ✍️ バズる投稿生成
        </h3>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>
          作成済みの記事をそのまま貼り付けてください
        </p>
      </div>

      {/* 記事貼り付けエリア */}
      <div style={cardStyle}>
        <div style={labelStyle}>📄 記事本文を貼り付け</div>
        <textarea
          value={articleText}
          onChange={e => setArticleText(e.target.value)}
          placeholder="作成済みの記事・台本をここに貼り付けてください&#10;&#10;例）&#10;片思いって、本当に消耗するよね。&#10;好きな人のことを考えるだけで...&#10;&#10;※記事本文は変更・削除・要約しません"
          rows={8}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #fce7f3',
            fontSize: '13px',
            lineHeight: '1.7',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            color: '#374151',
            backgroundColor: '#fffafa',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: '6px', textAlign: 'right', fontSize: '11px', color: '#9ca3af' }}>
          {articleText.length}文字 ／ 使用設定：{tiktokLength}字
        </div>
      </div>

      {/* 現在の設定表示 */}
      <div style={{ ...cardStyle, backgroundColor: '#fdf2f8', padding: '12px' }}>
        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '6px' }}>
          📌 現在の設定を自動適用
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '11px', backgroundColor: '#FFE0EC', color: '#72243E', padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>
            {tiktokLength}字設定
          </span>
          {profileCta && (
            <span style={{ fontSize: '11px', backgroundColor: '#FFE0EC', color: '#72243E', padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>
              CTA設定済み
            </span>
          )}
          {postUrl && (
            <span style={{ fontSize: '11px', backgroundColor: '#FFE0EC', color: '#72243E', padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>
              URL設定済み
            </span>
          )}
        </div>
      </div>

      {/* 生成ボタン */}
      <button
        onClick={handleClick}
        disabled={isLoading || !articleText.trim()}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '14px',
          border: 'none',
          fontSize: '15px',
          fontWeight: '900',
          cursor: !articleText.trim() || isLoading ? 'not-allowed' : 'pointer',
          background: !articleText.trim() || isLoading
            ? '#ccc'
            : 'linear-gradient(135deg, #F472B6 0%, #D4537E 50%, #9333EA 100%)',
          color: '#fff',
          boxShadow: !articleText.trim() || isLoading ? 'none' : '0 4px 20px rgba(212,83,126,0.4)',
          transition: 'all 0.2s',
          letterSpacing: '0.5px',
          marginBottom: '20px',
        }}
      >
        {isLoading
          ? '⟳ 分析・生成中...'
          : '🔥 バズる投稿を生成する'}
      </button>

      {/* 生成結果 */}
      {result && (
        <div>
          {/* 感情タイプ・投稿タイプバッジ */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px', fontWeight: '800',
              backgroundColor: '#EDE9FE', color: '#5B21B6',
              padding: '4px 12px', borderRadius: '20px',
            }}>
              感情：{result.emotionType}
            </span>
            <span style={{
              fontSize: '12px', fontWeight: '800',
              backgroundColor: '#FCE7F3', color: '#9D174D',
              padding: '4px 12px', borderRadius: '20px',
            }}>
              タイプ：{result.postType}
            </span>
          </div>

          {/* バズ投稿文 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={labelStyle}>🔥 バズる投稿文</div>
              <CopyButton text={result.postText} />
            </div>
            <pre style={{
              fontSize: '13px', lineHeight: '1.8', margin: 0,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              color: '#374151', fontFamily: 'inherit',
            }}>
              {result.postText}
            </pre>
          </div>

          {/* ハッシュタグ */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={labelStyle}># ハッシュタグ（5個）</div>
              <CopyButton text={result.hashtagText} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {result.hashtags.map((tag, i) => (
                <span key={i} style={{
                  fontSize: '12px', fontWeight: '700',
                  backgroundColor: '#EDE9FE', color: '#5B21B6',
                  padding: '4px 10px', borderRadius: '20px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
              記事内容を分析して生成した動的ハッシュタグです
            </p>
          </div>

          {/* BAZZ SCORE */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={labelStyle}>⚡ BAZZ SCORE（推定）</div>
              <div style={{
                fontSize: '22px', fontWeight: '900',
                color: result.score.total >= 85 ? '#10B981' : result.score.total >= 70 ? '#F59E0B' : '#EF4444',
              }}>
                {result.score.total}<span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>/100</span>
              </div>
            </div>
            <ScoreBar label="共感力" value={result.score.empathy} />
            <ScoreBar label="保存率" value={result.score.saveRate} />
            <ScoreBar label="クリック率" value={result.score.clickRate} />
            <ScoreBar label="拡散率" value={result.score.spreadRate} />
            <ScoreBar label="コメント率" value={result.score.commentRate} />
            <ScoreBar label="プロフィール誘導力" value={result.score.profileRate} />
            <p style={{ fontSize: '10px', color: '#9ca3af', margin: '10px 0 0', textAlign: 'right' }}>
              ※推定スコアです
            </p>
          </div>

          {/* 改善提案（95点未満のみ） */}
          {result.improvement && (
            <div style={{ ...cardStyle, backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div style={{ ...labelStyle, color: '#92400E' }}>💡 改善提案</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'フック改善', text: result.improvement.hookSuggestion },
                  { label: '感情強化', text: result.improvement.emotionSuggestion },
                  { label: '保存率UP', text: result.improvement.saveSuggestion },
                  { label: 'クリック率UP', text: result.improvement.clickSuggestion },
                ].map(({ label, text }) => (
                  <div key={label} style={{
                    backgroundColor: '#fff',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #FDE68A',
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginRight: '6px' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* スコアが95点以上の場合 */}
          {!result.improvement && (
            <div style={{ ...cardStyle, backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontWeight: '900', color: '#065F46', margin: 0 }}>
                🎉 スコア95点以上！このまま投稿GO!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

