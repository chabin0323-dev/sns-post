export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { siteUrl, username, appPassword, title, content, status } = req.body || {};

  if (!siteUrl || !username || !appPassword || !title || !content) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }

  try {
    const normalizedUrl = siteUrl.replace(/\/+$/, '');
    const endpoint = `${normalizedUrl}/wp-json/wp/v2/posts`;
    const authHeader = 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64');

    const wpRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        title,
        content,
        status: status || 'draft',
      }),
    });

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({ error: data?.message || 'WordPressへの投稿に失敗しました', detail: data });
    }

    return res.status(200).json({
      success: true,
      postId: data.id,
      link: data.link,
      status: data.status,
    });
  } catch (err) {
    return res.status(500).json({ error: 'サーバーエラーが発生しました', detail: String(err) });
  }
}
