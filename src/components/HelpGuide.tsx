import React from 'react';
import { X, FileText, Table, Upload, AlertCircle } from 'lucide-react';

interface HelpGuideProps {
  onClose: () => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="glass-effect rounded-xl p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-400">Data Input Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            aria-label="Close guide"
            title="Close guide"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5" /> File Upload
            </h3>
            <div className="space-y-2">
              <p>You can upload your data in various formats:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>CSV/Excel:</strong> Structured data with headers matching the required fields</li>
                <li><strong>JSON:</strong> Array of objects with required properties</li>
                <li><strong>Text/Markdown:</strong> Tab-separated values, one post per line</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <Table className="h-5 w-5" /> Required Fields
            </h3>
            <div className="space-y-2">
              <p>The following fields are mandatory for each post:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Post ID:</strong> Unique identifier for each post</li>
                <li><strong>Post Type:</strong> carousel, reel, image, or text</li>
                <li><strong>Likes:</strong> Number of likes received</li>
                <li><strong>Shares:</strong> Number of times shared</li>
                <li><strong>Comments:</strong> Number of comments received</li>
                <li><strong>Date:</strong> Post publication date and time</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" /> File Format Examples
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2">CSV Format:</p>
                <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto">
                  id,type,content,likes,shares,comments,date,views,saves,engagementRate
                  post1,image,Sample content,100,50,30,2024-03-20,1000,75,5.2
                </pre>
              </div>
              <div>
                <p className="font-semibold mb-2">JSON Format:</p>
                <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto">
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
          </section>

          <section>
            <h3 className="text-xl font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Tips
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ensure all required fields are filled when using manual entry</li>
              <li>Use commas to separate multiple hashtags</li>
              <li>The engagement rate is calculated as a percentage</li>
              <li>Content length is automatically calculated</li>
              <li>Date should be in YYYY-MM-DD format</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}; 