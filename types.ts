export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type Theme =
  | '脈なし' | '脈あり' | '男性心理' | 'LINE' | '片思い' | '復縁'
  | '運命の人' | '恋愛心理学' | '職場恋愛' | '人間関係' | '婚活'
  | '年の差恋愛' | '既婚者の恋愛' | 'マッチングアプリ' | '不倫' | 'セフレ友達以上';

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
