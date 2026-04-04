export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface BuzzScene {
  id: string;
  title: string;
  text: string;
  englishKeyword: string;
  durationSec: number;
}

export interface BuzzScriptPack {
  questionTitle: string;
  hook: string;
  denial: string;
  empathyStory: string;
  shockOrSolution: string;
  pullLine: string;
  scenes: BuzzScene[];
  fullScript: string;
}

export interface TrendPack {
  trendKeywords: string[];
  hookPatterns: string[];
  structureTemplates: string[];
  generatedTrendTitle: string;
}

export interface InfiniteIdeaPack {
  fortuneSummary: string;
  loveStory: string;
  endlessIdeas: string[];
}

export interface ScheduleItem {
  id: string;
  label: string;
  time: string;
  outputTitle: string;
  status: 'draft' | 'ready';
}

export interface PostPackage {
  tiktokCaption: string;
  finalCta: string;
  hashtags: string[];
  readyToPostText: string;
}

export interface BuzzAnalysis {
  score: number;
  strengths: string[];
  weakPoints: string[];
  optimizationNext: string[];
  topThemesFromHistory: string[];
  topHookPatternsFromHistory: string[];
}

export interface AutoVideoResult {
  videoDataUrl: string;
  videoMimeType: string;
  sceneImages: string[];
  durationSec: number;
}

export interface GeneratedPost {
  title: string;
  content: string;
  hashtags: string[];
  capcutScript: string;
  xPost: string;
  instagramPost: string;
  youtubePost: string;

  theme?: string;
  timestamp?: Date | string;
  autoCtaEnabled?: boolean;
  scheduleTimes?: string[];
  hashtagMode?: 'あり' | 'なし';

  buzzScript?: BuzzScriptPack;
  trendPack?: TrendPack;
  ideaPack?: InfiniteIdeaPack;
  schedulePack?: ScheduleItem[];
  postPackage?: PostPackage;
  buzzAnalysis?: BuzzAnalysis;

  autoVideo?: AutoVideoResult | null;
}
