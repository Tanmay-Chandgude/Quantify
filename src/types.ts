export interface SocialMediaPost {
  id: string;
  type: 'carousel' | 'reel' | 'image' | 'text';
  content: string;
  likes: number;
  shares: number;
  comments: number;
  date: string;
  views?: number;
  saves?: number;
  engagementRate?: number;
  hashtags?: string[];
  contentLength: number;
}

export interface AnalyticsData {
  postType: string;
  avgLikes: number;
  avgShares: number;
  avgComments: number;
  totalPosts: number;
}