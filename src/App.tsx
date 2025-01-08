
import { useState, useEffect } from 'react';
import { BarChart2, MessageSquare, TrendingUp, Users, Share2, MessageCircle, HelpCircle, ArrowUp, FileType, Upload, Plus, FileSpreadsheet, X } from 'lucide-react';
import { AnalyticsChart } from './components/AnalyticsChart';
import { ChatInterface } from './components/ChatInterface';
import { SocialMediaPost, AnalyticsData } from './types';
import { HelpGuidePage } from './components/HelpGuidePage';
import { CustomModal } from './components/CustomModal';

function App() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([
    {
      postType: 'static image',
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
      postType: 'reels',
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      totalPosts: 0
    }
  ]);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState<Partial<SocialMediaPost>>({
    type: 'static image',
    likes: 0,
    shares: 0,
    comments: 0,
    views: 0,
    saves: 0,
    engagementRate: 0,
    contentLength: 0,
    platform: 'Instagram',
    sentimentScore: 'neutral',
    peakEngagementTime: '12:00',
    hashtags: []
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const validatePostType = (type: string): SocialMediaPost['type'] => {
    // Debug the incoming type
    console.log('Raw type value:', type);

    // Normalize the type string
    const normalizedType = type?.toLowerCase().trim();
    console.log('Normalized type:', normalizedType);

    // Map common variations to our expected types
    const typeMap: Record<string, SocialMediaPost['type']> = {
      'static': 'static image',
      'static image': 'static image',
      'staticimage': 'static image',
      'image': 'static image',
      'carousel': 'carousel',
      'carousels': 'carousel',
      'reel': 'reels',
      'reels': 'reels',
      'video': 'reels'
    };

    const mappedType = typeMap[normalizedType];
    console.log('Mapped type:', mappedType);

    if (!mappedType) {
      console.warn(`Invalid post type: ${type}, defaulting to 'static image'`);
      return 'static image';
    }

    return mappedType;
  };

  const processData = (data: SocialMediaPost[]) => {
    console.log('Processing data:', data); // Debug log

    // Initialize with all post types
    const postTypeMap: Record<string, { totalLikes: number; totalShares: number; totalComments: number; count: number }> = {
      'static image': { totalLikes: 0, totalShares: 0, totalComments: 0, count: 0 },
      'carousel': { totalLikes: 0, totalShares: 0, totalComments: 0, count: 0 },
      'reels': { totalLikes: 0, totalShares: 0, totalComments: 0, count: 0 }
    };

    // Process the data
    data.forEach(post => {
      console.log('Processing post type:', post.type); // Debug log
      if (postTypeMap[post.type]) {
        postTypeMap[post.type].totalLikes += post.likes;
        postTypeMap[post.type].totalShares += post.shares;
        postTypeMap[post.type].totalComments += post.comments;
        postTypeMap[post.type].count += 1;
      }
    });

    console.log('Post type map:', postTypeMap); // Debug log

    // Convert to analytics data
    const finalAnalytics = Object.entries(postTypeMap).map(([type, stats]) => ({
      postType: type,
      avgLikes: stats.count > 0 ? Math.round(stats.totalLikes / stats.count) : 0,
      avgShares: stats.count > 0 ? Math.round(stats.totalShares / stats.count) : 0,
      avgComments: stats.count > 0 ? Math.round(stats.totalComments / stats.count) : 0,
      totalPosts: stats.count
    }));

    console.log('Final analytics:', finalAnalytics); // Debug log
    setAnalyticsData(finalAnalytics);
  };

  const getTotalMetrics = () => {
    if (analyticsData.length === 0) {
      return {
        posts: 0,
        likes: 0,
        shares: 0,
        comments: 0
      };
    }

    return {
      posts: analyticsData.reduce((acc, post) => acc + post.totalPosts, 0),
      likes: analyticsData.reduce((acc, post) => acc + post.avgLikes * post.totalPosts, 0),
      shares: analyticsData.reduce((acc, post) => acc + post.avgShares * post.totalPosts, 0),
      comments: analyticsData.reduce((acc, post) => acc + post.avgComments * post.totalPosts, 0)
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
    if (analyticsData.length === 0) {
      alert('No data available to generate report');
      return;
    }

    const reportContent = `Social Media Analytics Report
${new Date().toLocaleDateString()}

Overall Performance
------------------
Total Posts: ${metrics.posts}
Total Likes: ${metrics.likes}
Total Shares: ${metrics.shares}
Total Comments: ${metrics.comments}

Performance by Post Type
-----------------------
${Object.entries(
  analyticsData.reduce((acc, post) => {
    if (!acc[post.postType]) acc[post.postType] = { posts: 0, likes: 0, shares: 0, comments: 0 };
    acc[post.postType].posts++;
    acc[post.postType].likes += post.avgLikes * post.totalPosts;
    acc[post.postType].shares += post.avgShares * post.totalPosts;
    acc[post.postType].comments += post.avgComments * post.totalPosts;
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
      setAlertMessage('Please upload a CSV file only');
      setShowAlertModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        try {
          const rows = text.split(/\r?\n/).filter(row => row.trim());
          const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
          
          console.log('Headers:', headers);
          const typeIndex = headers.indexOf('post_type');
          console.log('Type column index:', typeIndex);

          const data: SocialMediaPost[] = rows.slice(1)
            .map(row => {
              const values = row.split(',').map(val => val.trim());
              console.log('Row values:', values);
              const rawType = values[typeIndex];
              console.log('Raw type value:', rawType);
              
              const post = {
                id: values[headers.indexOf('post_id')] || Math.random().toString(36).substr(2, 9),
                type: validatePostType(rawType),
                content: values[headers.indexOf('content')] || '',
                likes: parseInt(values[headers.indexOf('likes')]) || 0,
                shares: parseInt(values[headers.indexOf('shares')]) || 0,
                comments: parseInt(values[headers.indexOf('comments')]) || 0,
                date: values[headers.indexOf('post_date')] || new Date().toISOString().split('T')[0],
                views: parseInt(values[headers.indexOf('views')]) || 0,
                saves: parseInt(values[headers.indexOf('saves')]) || 0,
                engagementRate: parseFloat(values[headers.indexOf('user_engagement_rate')]) || 0,
                hashtags: [],
                contentLength: parseInt(values[headers.indexOf('content_length')]) || 0,
                platform: values[headers.indexOf('platform')] || 'Instagram',
                sentimentScore: values[headers.indexOf('sentiment_score')] || 'neutral',
                peakEngagementTime: values[headers.indexOf('peak_engagement_time')] || '12:00'
              };
              console.log('Processed post:', post);
              return post;
            })
            .filter(post => post.type && post.likes >= 0);

          console.log('Final processed data:', data);
          processData(data);
        } catch (error) {
          console.error('Error details:', error);
          setAlertMessage('Error processing CSV file. Please check the format and try again.');
          setShowAlertModal(true);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setAnalyticsData([
      {
        postType: 'static image',
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
        postType: 'reels',
        avgLikes: 0,
        avgShares: 0,
        avgComments: 0,
        totalPosts: 0
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: SocialMediaPost = {
      ...formData as Omit<SocialMediaPost, 'id'>,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      hashtags: [],
      content: ''
    };
    processData([newPost]);
    setShowModal(false);
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
                <button
                  onClick={handleReset}
                  className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
                >
                  Quantify
                </button>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-effect rounded-xl p-6 w-full max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-emerald-400">Add New Post</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                title="Close modal"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Post Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as SocialMediaPost['type'] })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    title="Select post type"
                    aria-label="Post type"
                  >
                    <option value="static image">Static Image</option>
                    <option value="carousel">Carousel</option>
                    <option value="reels">Reels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Platform *</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    title="Select platform"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Post Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    title="Post date and time"
                    placeholder="Select date and time"
                    aria-label="Post date and time"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Likes *</label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    placeholder="Enter likes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Shares *</label>
                  <input
                    type="number"
                    value={formData.shares}
                    onChange={(e) => setFormData({ ...formData, shares: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    placeholder="Enter shares"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Comments *</label>
                  <input
                    type="number"
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    placeholder="Enter comments"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Views</label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    placeholder="Enter views"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Saves</label>
                  <input
                    type="number"
                    value={formData.saves}
                    onChange={(e) => setFormData({ ...formData, saves: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    placeholder="Enter saves"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    value={formData.engagementRate}
                    onChange={(e) => setFormData({ ...formData, engagementRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sentiment Score</label>
                  <select
                    value={formData.sentimentScore}
                    onChange={(e) => setFormData({ ...formData, sentimentScore: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title="Select sentiment score"
                    aria-label="Sentiment score"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hashtags</label>
                  <textarea
                    value={formData.hashtags?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={2}
                    placeholder="Enter hashtags separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Peak Engagement Time</label>
                  <input
                    type="time"
                    value={formData.peakEngagementTime}
                    onChange={(e) => setFormData({ ...formData, peakEngagementTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title="Select peak engagement time"
                    placeholder="Select time"
                    aria-label="Peak engagement time"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Add Post
              </button>
            </form>
          </div>
        </div>
      )}

      {showAlertModal && (
        <CustomModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          title="Error"
          type="alert"
          message={alertMessage}
        />
      )}
    </div>
  );
}

export default App;
