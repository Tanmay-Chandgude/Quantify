export type SocialMediaPost = {
  id: string;
  type: 'static image' | 'carousel' | 'reels';
  content: string;
  likes: number;
  shares: number;
  comments: number;
  date: string;
  views: number;
  saves: number;
  engagementRate: number;
  hashtags: string[];
  contentLength: number;
  platform: string;
  sentimentScore: string;
  peakEngagementTime: string;
};

export interface AnalyticsData {
  postType: string;
  avgLikes: number;
  avgShares: number;
  avgComments: number;
  totalPosts: number;
}