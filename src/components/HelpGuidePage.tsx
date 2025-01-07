import React from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, BarChart2, MessageSquare, AlertTriangle } from 'lucide-react';

interface HelpGuidePageProps {
  onClose: () => void;
}

export const HelpGuidePage: React.FC<HelpGuidePageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
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
                <h3 className="text-xl font-semibold text-blue-400">File Upload</h3>
                <p>Upload your social media data in various formats:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>CSV/Excel:</strong> Structured data with headers</li>
                  <li><strong>JSON:</strong> Array of social media post objects</li>
                  <li><strong>Text/Markdown:</strong> Tab-separated values</li>
                  <li><strong>PDF:</strong> Structured text format</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-400 mt-6">Manual Entry</h3>
                <p>Add posts manually with the following fields:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Required Fields:</strong> Post ID, Type, Likes, Shares, Comments</li>
                  <li><strong>Optional Fields:</strong> Views, Saves, Engagement Rate, Hashtags</li>
                </ul>
              </div>
            </section>

            {/* Data Format Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6" /> Data Format
              </h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-blue-400">File Templates</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">CSV Format:</p>
                    <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto text-sm">
                      id,type,content,likes,shares,comments,date,views,saves,engagementRate,hashtags
                      post1,image,Sample content,100,50,30,2024-03-20,1000,75,5.2,tag1;tag2
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">JSON Format:</p>
                    <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify([{
                        id: "post1",
                        type: "image",
                        content: "Sample content",
                        likes: 100,
                        shares: 50,
                        comments: 30,
                        date: "2024-03-20"
                      }], null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Section */}
            <section className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <BarChart2 className="h-6 w-6" /> Analytics Features
              </h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-blue-400">Available Charts</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Bar Chart:</strong> Compare metrics across post types</li>
                  <li><strong>Line Chart:</strong> Track trends and patterns</li>
                  <li><strong>Area Chart:</strong> Visualize data distribution</li>
                </ul>

                <h3 className="text-xl font-semibold text-blue-400 mt-6">Metrics Tracked</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Average Likes per Post Type</li>
                  <li>Average Shares per Post Type</li>
                  <li>Average Comments per Post Type</li>
                  <li>Total Posts per Category</li>
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
                  <li><strong>File Upload Errors:</strong> Check file format and structure</li>
                  <li><strong>Data Format Issues:</strong> Ensure required fields are present</li>
                  <li><strong>Chart Display Problems:</strong> Verify data consistency</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}; 