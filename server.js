import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8080;

// ESモジュールでの__dirnameの解決
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ② ブラウザ差によるエラーを防ぐため、CORSを許可
// ③ 履歴アクセスと新規アクセスの差をなくすため、キャッシュを無効化
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  next();
});

// 静的ファイルの提供（ビルド出力先が 'dist' であると仮定）
app.use(express.static(path.join(__dirname, 'dist')));

// ① ルートURL（またはヘルスチェック）での稼働確認
// ④ レスポンスのContent-Typeを明示 (JSONの場合の例)
// 注意: ルートパス '/' をテキストで上書きするとReactアプリが表示されなくなるため、
// 稼働確認用のメッセージは '/health' エンドポイントで提供し、
// ブラウザからの通常アクセスは下の '*' ルートでindex.htmlを返します。
app.get('/health', (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify({ message: "サービスは稼働中です" }));
});

// SPAのルーティング対応（すべてのリクエストをindex.htmlへ）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});