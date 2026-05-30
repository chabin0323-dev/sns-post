export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

// テーマを固定リストからstring型に変更（自由入力対応）
export type Theme = string;

export type HookType = '否定系' | '不安系' | '暴露系' | '男性心理系' | '実は系';

export type OutputKey =
  | 'mainContent'
  | 'hashtags'
  | 'threads'
  | 'x'
  | 'note'
  | 'noteUrl'
  | 'seo'
  | 'thumbnail';

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
  theme: Theme;
  hookType: HookType;
  prevTitle: string;
  mainContent: string;
  hashtags: string[];
  hashtagText: string;
  threadsPost: string;
  xPost: string;
  noteArticle: string;
  noteUrl: string;
  seoSet: {
    title: string;
    keywords: string[];
    description: string;
  };
  thumbnailPrompt: string;
  buzzScore: BuzzScore;
  timestamp: string;
}
