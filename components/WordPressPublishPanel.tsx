import React, { useState } from 'react';

interface WordPressPublishPanelProps {
  postContent: string;
}

export const WordPressPublishPanel: React.FC<WordPressPublishPanelProps> = ({ postContent }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'draft' | 'publish'>('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; link?: string } | null>(null);

  const handlePublish = async () => {
    if (!siteUrl || !username || !appPassword || !title) {
      setResult({ success: false, message: 'サイトURL・ユーザー名・アプリケーションパスワード・タイトルを入力してください' });
      return;
    }
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/wp-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl, username, appPassword, title, content: postContent, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResult({ success: false, message: data.error || '投稿に失敗しました' });
      } else {
        setResult({
          success: true,
          message: status === 'publish' ? '公開しました！' : '下書きとして保存しました！',
          link: data.link,
        });
      }
    } catch {
      setResult({ success: false, message: '通信エラーが発生しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-sm font-semibold mb-3">WordPressに投稿</h3>
      <div className="space-y-2">
        <input type="text" placeholder="WordPressサイトURL（例: https://example.com）" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="password" placeholder="アプリケーションパスワード" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="text" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1"><input type="radio" checked={status === 'draft'} onChange={() => setStatus('draft')} />下書き保存</label>
          <label className="flex items-center gap-1"><input type="radio" checked={status === 'publish'} onChange={() => setStatus('publish')} />すぐ公開</label>
        </div>
        <button onClick={handlePublish} disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50">
          {isSubmitting ? '投稿中...' : 'WordPressに投稿する'}
        </button>
        {result && (
          <div className={`text-sm p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {result.message}
            {result.link && <a href={result.link} target="_blank" rel="noopener noreferrer" className="block underline mt-1">投稿を確認する</a>}
          </div>
        )}
      </div>
    </div>
  );
};
