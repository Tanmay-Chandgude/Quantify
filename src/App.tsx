import { useState } from 'react';
import { BarChart2, MessageSquare, TrendingUp, Users, Share2, MessageCircle } from 'lucide-react';
import { DataInput } from './components/DataInput';
import { AnalyticsChart } from './components/AnalyticsChart';
import { ChatInterface } from './components/ChatInterface';
import { SocialMediaPost, AnalyticsData } from './types';

function App() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([
    {
      postType: 'image',
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      totalPosts: 0
    },
    {
      postType: 'carousel',
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      totalPosts: 0
    },
    {
      postType: 'reel',
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      totalPosts: 0
    },
    {
      postType: 'text',
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      totalPosts: 0
    }
  ]);
  const [rawData, setRawData] = useState<SocialMediaPost[]>([]);

  const processData = (data: SocialMediaPost[]) => {
    setRawData(data);
    
    const postTypes = [...new Set(data.map(post => post.type))];
    const analytics = postTypes.map(type => {
      const postsOfType = data.filter(post => post.type === type);
      return {
        postType: type,
        avgLikes: Math.round(postsOfType.reduce((acc, post) => acc + post.likes, 0) / postsOfType.length),
        avgShares: Math.round(postsOfType.reduce((acc, post) => acc + post.shares, 0) / postsOfType.length),
        avgComments: Math.round(postsOfType.reduce((acc, post) => acc + post.comments, 0) / postsOfType.length),
        totalPosts: postsOfType.length
      };
    });

    setAnalyticsData(analytics);
  };

  const getTotalMetrics = () => {
    if (rawData.length === 0) {
      return {
        posts: 0,
        likes: 0,
        shares: 0,
        comments: 0
      };
    }

    return {
      posts: rawData.length,
      likes: rawData.reduce((acc, post) => acc + (post.likes || 0), 0),
      shares: rawData.reduce((acc, post) => acc + (post.shares || 0), 0),
      comments: rawData.reduce((acc, post) => acc + (post.comments || 0), 0)
    };
  };

  const metrics = getTotalMetrics();

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <nav className="glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                Quantify
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300 glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Posts</p>
                <p className="text-2xl font-bold text-emerald-400">{metrics.posts}</p>
              </div>
              <div className="bg-emerald-400/10 p-3 rounded-lg">
                <BarChart2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300 glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Likes</p>
                <p className="text-2xl font-bold text-blue-400">{metrics.likes}</p>
              </div>
              <div className="bg-blue-400/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300 glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Shares</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.shares}</p>
              </div>
              <div className="bg-purple-400/10 p-3 rounded-lg">
                <Share2 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all duration-300 glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Comments</p>
                <p className="text-2xl font-bold text-pink-400">{metrics.comments}</p>
              </div>
              <div className="bg-pink-400/10 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-pink-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
              <BarChart2 className="text-emerald-400" /> Data Input
            </h2>
            <DataInput onDataLoaded={processData} />
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-400">Engagement Analytics</h2>
            <AnalyticsChart data={analyticsData} />
          </div>

          <div className="lg:col-span-2 glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
              <MessageSquare className="text-emerald-400" /> AI Insights
            </h2>
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;