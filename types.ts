// types.ts（完全版）
// 既存の型定義はそのまま維持し、末尾にBuzzPost関連型を追記しています

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Genre =
  | '恋愛' | 'お金・資産' | '副業・稼ぐ' | '美容・ダイエット' | '育児・子育て'
  | '健康・メンタル' | '転職・キャリア' | '人間関係' | 'ビジネス・起業' | 'ライフスタイル';

export type Theme =
  | '脈なし' | '脈あり' | '男性心理' | 'LINE' | '片思い' | '復縁' | '運命の人' | '恋愛心理学' | '職場恋愛' | '婚活' | 'マッチングアプリ'
  | '節約術' | '投資入門' | 'NISA活用' | '貯金習慣' | '給料アップ' | '保険見直し' | '副収入' | 'クレカ活用' | 'ポイント最大化' | '老後資金'
  | 'TikTok収益化' | 'Threads攻略' | 'note有料記事' | 'SNS運用' | 'ブログ収益' | '転売・せどり' | 'コンテンツ販売' | 'フリーランス' | 'YouTube運用' | 'X(Twitter)運用'
  | 'スキンケア' | '痩せる食事' | 'ながら運動' | 'プチプラコスメ' | '髪ケア' | 'むくみ解消' | '睡眠美容' | '体質改善' | 'ファスティング' | 'ボディメイク'
  | '知育おもちゃ' | '寝かしつけ' | '離乳食' | 'イヤイヤ期' | '保育園選び' | '子どもの習い事' | '夫婦育児分担' | '産後ケア' | '絵本読み聞かせ' | '子どもの褒め方'
  | '自律神経' | 'ストレス解消' | '腸活' | '良質な睡眠' | 'マインドフルネス' | '疲れない体' | 'うつ予防' | '免疫力アップ' | '血糖値管理' | 'デジタルデトックス'
  | '転職成功' | '年収アップ' | 'スキルアップ' | '面接対策' | '履歴書・職務経歴書' | 'リモートワーク' | '副業から独立' | 'AI活用仕事術' | '昇進交渉' | 'ワークライフバランス'
  | '職場いじめ' | '毒親' | '友達付き合い' | 'ママ友' | '義実家問題' | '自己肯定感' | 'コミュ力アップ' | '断り方' | '人たらし術' | 'HSP生き方'
  | '起業アイデア' | 'SNSマーケ' | '集客術' | '価格設定' | 'Canva活用' | 'ChatGPT活用' | '個人ブランディング' | 'コンテンツマーケ' | 'LINE公式活用' | 'ストーリーズ活用'
  | 'ミニマリスト' | '朝活' | '読書習慣' | '手帳活用' | '一人暮らし節約' | 'おうち時間' | '旅行ハック' | 'サウナ効果' | 'ペット' | 'インテリア';

export type HookType = '否定系' | '不安系' | '暴露系' | '共感系' | '実は系' | '数字系' | '限定系';

export type OutputKey =
  | 'mainContent' | 'hashtags' | 'threads' | 'x'
  | 'note' | 'seo' | 'thumbnailTikTok' | 'thumbnailNote';

export interface BuzzScore {
  hookPower: number;
  saveRate: number;
  commentRate: number;
  profileRate: number;
  seoScore: number;
  total: number;
  comment: string;
}

export interface GeneratedContent {
  genre: Genre;
  theme: Theme;
  hookType?: HookType;
  prevTitle: string;
  mainContent: string;
  hashtags: string[];
  hashtagText: string;
  threadsPost: string;
  xPost: string;
  noteArticle: string;
  noteUrl?: string;
  seoSet: {
    title: string;
    keywords: string[];
    description: string;
    howToUse: string;
  };
  thumbnailPrompt: string;
  thumbnailTikTok: string;
  thumbnailNote: string;
  buzzScore: BuzzScore;
  nextTitles?: string[];
  timestamp: string;
}

// ============================================================
// ↓↓↓ 以下を既存types.tsの末尾に追記 ↓↓↓
// （BuzzPostPanel / buzzPostGeneratorで使用する新規型）
// ============================================================

export interface BuzzPostScore {
  empathy: number;       // 共感力
  saveRate: number;      // 保存率
  clickRate: number;     // クリック率
  spreadRate: number;    // 拡散率
  commentRate: number;   // コメント率
  profileRate: number;   // プロフィール誘導力
  total: number;         // 総合スコア（0〜100）
}

export interface BuzzImprovement {
  hookSuggestion: string;     // フック改善案
  emotionSuggestion: string;  // 感情強化案
  saveSuggestion: string;     // 保存率改善案
  clickSuggestion: string;    // クリック率改善案
}

export interface BuzzPostResult {
  postText: string;           // バズ投稿文
  hashtags: string[];         // 動的ハッシュタグ（プラットフォーム別）
  hashtagText: string;        // ハッシュタグ連結文字列
  emotionType: string;        // 分析された感情タイプ
  postType: string;           // 投稿タイプ
  score: BuzzPostScore;       // BAZZ SCORE
  improvement: BuzzImprovement | null;  // 改善提案（95点未満のみ）
  noteArticle: string;        // note記事
  seoTitle: string;           // SEOタイトル
  seoKeywords: string[];      // SEOキーワード
  metaDescription: string;    // メタディスクリプション
  articleTitle: string;       // 記事タイトル
  thumbnailTitle: string;     // サムネイル用タイトル
  threadsPost: string;        // Threads投稿文
  xPost: string;              // X投稿文
  instagramPost: string;      // Instagram投稿文
  youtubePost: string;        // YouTube Shorts投稿文
  profileCtaText: string;     // プロフィール誘導文（表示用）
  postUrlText: string;        // 投稿URL（表示用）
  thumbnailTikTok: string;    // TikTok画像生成指示文（1080×1920）
  thumbnailNote: string;      // note画像生成指示文（1280×670）
  seoSpecialTitle: string;    // SEO特化タイトル（検索流入・クリック率重視）
}
