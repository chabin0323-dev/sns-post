import React, { useState } from 'react';

interface WordPressPublishPanelProps {
  postContent: string;
  suggestedTitle?: string;
}

const WP_SETTINGS_KEY = 'wp_publish_settings_v1';

export const WordPressPublishPanel: React.FC<WordPressPublishPanelProps> = ({ postContent, suggestedTitle }) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'draft' | 'publish'>('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; link?: string } | null>(null);

  // サイトURL・ユーザー名・アプリケーションパスワードだけ記憶する（タイトルは記事ごとに変わるため記憶しない）
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(WP_SETTINGS_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.siteUrl) setSiteUrl(p.siteUrl);
        if (p.username) setUsername(p.username);
        if (p.appPassword) setAppPassword(p.appPassword);
      }
    } catch {}
  }, []);

  // 新しい記事が生成されるたびに、自動生成されたタイトル案でタイトル欄を更新する
  React.useEffect(() => {
    if (suggestedTitle) {
      setTitle(suggestedTitle);
      setResult(null);
    }
  }, [suggestedTitle]);

  const saveSettings = (next: Partial<{ siteUrl: string; username: string; appPassword: string }>) => {
    try {
      const current = JSON.parse(localStorage.getItem(WP_SETTINGS_KEY) || '{}');
      localStorage.setItem(WP_SETTINGS_KEY, JSON.stringify({ ...current, ...next }));
    } catch {}
  };

  const handleSiteUrlChange = (val: string) => { setSiteUrl(val); saveSettings({ siteUrl: val }); };
  const handleUsernameChange = (val: string) => { setUsername(val); saveSettings({ username: val }); };
  const handleAppPasswordChange = (val: string) => { setAppPassword(val); saveSettings({ appPassword: val }); };
  const handleTitleChange = (val: string) => { setTitle(val); };

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
        <input type="text" placeholder="WordPressサイトURL（例: https://example.com）" value={siteUrl} onChange={(e) => handleSiteUrlChange(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="text" placeholder="ユーザー名" value={username} onChange={(e) => handleUsernameChange(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="password" placeholder="アプリケーションパスワード" value={appPassword} onChange={(e) => handleAppPasswordChange(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <input type="text" placeholder="タイトル" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        <p className="text-xs text-gray-400 -mt-1">記事生成のたびに自動でタイトル案が入ります。投稿前に自由に書き換えてください。</p>
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
