import React from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, BarChart2, MessageSquare, AlertTriangle } from 'lucide-react';

interface HelpGuidePageProps {
  onClose: () => void;
}

export const HelpGuidePage: React.FC<HelpGuidePageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto help-guide-container">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold text-emerald-400 mb-8">Help Guide</h1>

          <div className="space-y-12">
            {/* Data Input Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <Upload className="h-6 w-6" /> Data Input
              </h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-blue-400">CSV File Format</h3>
                <p>Your CSV file should include the following columns:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>id:</strong> Unique identifier for each post</li>
                  <li><strong>type:</strong> Post type (image, carousel, reel, or text)</li>
                  <li><strong>content:</strong> Post content or description</li>
                  <li><strong>likes:</strong> Number of likes</li>
                  <li><strong>shares:</strong> Number of shares</li>
                  <li><strong>comments:</strong> Number of comments</li>
                  <li><strong>date:</strong> Post date (YYYY-MM-DD format)</li>
                  <li><strong>views:</strong> Number of views</li>
                  <li><strong>saves:</strong> Number of saves</li>
                  <li><strong>engagementRate:</strong> Engagement rate percentage</li>
                  <li><strong>hashtags:</strong> Comma-separated hashtags</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-400 mt-6">Sample CSV Format</h3>
                <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto text-sm">
                  id,type,content,likes,shares,comments,date,views,saves,engagementRate,hashtags
                  post1,image,Sample content,100,50,30,2024-03-20,1000,75,5.2,tag1;tag2;tag3
                </pre>
              </div>
            </section>

            {/* Analytics Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <BarChart2 className="h-6 w-6" /> Analytics Features
              </h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-blue-400">Dashboard Metrics</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Total Posts:</strong> Overall number of posts analyzed</li>
                  <li><strong>Total Likes:</strong> Cumulative likes across all posts</li>
                  <li><strong>Total Shares:</strong> Cumulative shares across all posts</li>
                  <li><strong>Total Comments:</strong> Cumulative comments across all posts</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-400 mt-6">Engagement Charts</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Compare metrics across different post types</li>
                  <li>View average engagement rates</li>
                  <li>Analyze performance trends</li>
                </ul>
              </div>
            </section>

            {/* Report Generation */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6" /> Report Generation
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Generate comprehensive analytics reports including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Overall performance metrics</li>
                  <li>Performance breakdown by post type</li>
                  <li>Average engagement metrics</li>
                  <li>Detailed statistics for each content type</li>
                </ul>
              </div>
            </section>

            {/* AI Insights Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> AI Insights
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Get AI-powered insights about your social media performance:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyze engagement patterns</li>
                  <li>Get content recommendations</li>
                  <li>Identify top-performing post types</li>
                  <li>Receive optimization suggestions</li>
                </ul>
              </div>
            </section>

            {/* Troubleshooting Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> Troubleshooting
              </h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-blue-400">Common Issues</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>File Format:</strong> Ensure your CSV file follows the required format</li>
                  <li><strong>Data Types:</strong> Make sure numeric fields contain valid numbers</li>
                  <li><strong>Post Types:</strong> Use only supported post types (image, carousel, reel, text)</li>
                  <li><strong>Date Format:</strong> Use YYYY-MM-DD format for dates</li>
                  <li><strong>Hashtags:</strong> Separate multiple hashtags with semicolons</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}; 