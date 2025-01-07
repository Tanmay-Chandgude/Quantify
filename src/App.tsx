import { useState, useEffect } from 'react';
import { BarChart2, MessageSquare, TrendingUp, Users, Share2, MessageCircle, HelpCircle, ArrowUp, FileType, Upload, Plus, FileSpreadsheet } from 'lucide-react';
import { AnalyticsChart } from './components/AnalyticsChart';
import { ChatInterface } from './components/ChatInterface';
import { SocialMediaPost, AnalyticsData } from './types';
import { HelpGuidePage } from './components/HelpGuidePage';
import { CustomModal } from './components/CustomModal';

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
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDownloadReport = () => {
    if (rawData.length === 0) {
      alert('No data available to generate report');
      return;
    }

    const reportContent = `Social Media Analytics Report
${new Date().toLocaleDateString()}

Overall Performance
------------------
Total Posts: ${rawData.length}
Total Likes: ${rawData.reduce((acc, post) => acc + post.likes, 0)}
Total Shares: ${rawData.reduce((acc, post) => acc + post.shares, 0)}
Total Comments: ${rawData.reduce((acc, post) => acc + post.comments, 0)}

Performance by Post Type
-----------------------
${Object.entries(
  rawData.reduce((acc, post) => {
    if (!acc[post.type]) acc[post.type] = { posts: 0, likes: 0, shares: 0, comments: 0 };
    acc[post.type].posts++;
    acc[post.type].likes += post.likes;
    acc[post.type].shares += post.shares;
    acc[post.type].comments += post.comments;
    return acc;
  }, {} as Record<string, { posts: number; likes: number; shares: number; comments: number }>)
).map(([type, stats]) => 
  `${type.toUpperCase()}:
   Posts: ${stats.posts}
   Avg. Likes: ${(stats.likes / stats.posts).toFixed(2)}
   Avg. Shares: ${(stats.shares / stats.posts).toFixed(2)}
   Avg. Comments: ${(stats.comments / stats.posts).toFixed(2)}`
).join('\n\n')}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/csv') {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data: SocialMediaPost[] = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const values = row.split(',');
            return {
              id: values[0] || Math.random().toString(36).substr(2, 9),
              type: values[1] as SocialMediaPost['type'] || 'image',
              content: values[2] || '',
              likes: parseInt(values[3]) || 0,
              shares: parseInt(values[4]) || 0,
              comments: parseInt(values[5]) || 0,
              date: values[6] || new Date().toISOString().split('T')[0],
              views: parseInt(values[7]) || 0,
              saves: parseInt(values[8]) || 0,
              engagementRate: parseFloat(values[9]) || 0,
              hashtags: values[10] ? values[10].split(';') : [],
              contentLength: values[2]?.length || 0
            };
          });
        processData(data);
      }
    };
    reader.readAsText(file);
  };

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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                  Quantify
                </span>
              </div>
              <span className="text-gray-400 hidden md:block">|</span>
              <span className="text-sm text-gray-400 hidden md:block">
                Social Media Analytics Dashboard
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a 
                href="#analytics" 
                className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                onClick={() => document.querySelector('#analytics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <BarChart2 size={18} />
                <span>Analytics</span>
              </a>
              <a 
                href="#ai-insights" 
                className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                onClick={() => document.querySelector('#ai-insights')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageSquare size={18} />
                <span>AI Insights</span>
              </a>
              <button 
                onClick={() => setShowHelpPage(true)} 
                className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <HelpCircle size={18} />
                <span>Help</span>
              </button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="col-span-2 glass-effect rounded-xl p-6 border-2 border-dashed border-gray-700 hover:border-emerald-500/50 transition-colors cursor-pointer relative group"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  aria-label="Upload CSV file"
                  title="Upload CSV file"
                />
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="p-4 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-emerald-400">Drop your CSV file here</p>
                    <p className="text-sm text-gray-400">or click to browse</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FileType size={16} />
                    <span>Supported format: CSV</span>
                  </div>
                </div>
                {dragActive && (
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <p className="text-lg font-semibold text-emerald-400">Drop to upload</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 text-white rounded-xl transition-all duration-300 group"
                >
                  <Plus className="h-5 w-5 text-emerald-400 group-hover:rotate-90 transition-transform" />
                  <span className="font-semibold">Manual Entry</span>
                </button>

                <button 
                  onClick={handleDownloadReport}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-xl transition-all duration-300 group"
                >
                  <FileSpreadsheet className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold">Download Report</span>
                </button>

                <div className="glass-effect rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                    <button
                      onClick={() => setShowHelpPage(true)}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors text-left"
                    >
                      Need help? Check out our comprehensive guide.
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="analytics" className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 text-emerald-400">Engagement Analytics</h2>
            <AnalyticsChart data={analyticsData} />
          </div>

          <div id="ai-insights" className="lg:col-span-2 glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
              <MessageSquare className="text-emerald-400" /> AI Insights
            </h2>
            <ChatInterface />
          </div>
        </div>
      </div>

      {showHelpPage && <HelpGuidePage onClose={() => setShowHelpPage(false)} />}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-1 p-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all duration-300 backdrop-blur-sm"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {showModal && (
        <CustomModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Manual Entry"
          type="select"
          message="Enter your social media post data:"
          options={['Add Post']}
          onSelect={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;