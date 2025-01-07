import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Plus, X, FileType, HelpCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { SocialMediaPost } from '../types';
import { HelpGuide } from './HelpGuide';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface DataInputProps {
  onDataLoaded: (data: SocialMediaPost[]) => void;
}

export const DataInput: React.FC<DataInputProps> = ({ onDataLoaded }) => {
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<Partial<SocialMediaPost>>({
    id: '',
    type: 'image',
    content: '',
    likes: 0,
    shares: 0,
    comments: 0,
    date: new Date().toISOString().split('T')[0],
    views: 0,
    saves: 0,
    engagementRate: 0,
    hashtags: [],
    contentLength: 0
  });
  const [showHelp, setShowHelp] = useState(false);

  const validatePostType = (type: string): SocialMediaPost['type'] => {
    const validTypes = ['carousel', 'reel', 'image', 'text'] as const;
    return validTypes.includes(type as any) ? type as SocialMediaPost['type'] : 'text';
  };

  const handleFileUpload = useCallback((file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let parsedData: SocialMediaPost[] = [];
        const content = e.target?.result;

        switch (fileExtension) {
          case 'csv':
      Papa.parse(file, {
        complete: (results) => {
                parsedData = results.data.map((row: any) => ({
            id: row.id || Math.random().toString(36).substr(2, 9),
                  type: validatePostType(row.type),
                  content: row.content || '',
                  likes: parseInt(row.likes) || 0,
                  shares: parseInt(row.shares) || 0,
                  comments: parseInt(row.comments) || 0,
                  date: row.date || new Date().toISOString().split('T')[0],
                  views: parseInt(row.views) || 0,
                  saves: parseInt(row.saves) || 0,
                  engagementRate: parseFloat(row.engagementRate) || 0,
                  hashtags: row.hashtags ? row.hashtags.split(',').map((tag: string) => tag.trim()) : [],
                  contentLength: row.content?.length || 0
          }));
          onDataLoaded(parsedData);
        },
        header: true
      });
            break;

          case 'xlsx':
          case 'xls':
            const workbook = XLSX.read(content, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
            parsedData = jsonData.map((row: any) => ({
              id: row.id || Math.random().toString(36).substr(2, 9),
              type: validatePostType(row.type),
              content: row.content || '',
              likes: parseInt(row.likes) || 0,
              shares: parseInt(row.shares) || 0,
              comments: parseInt(row.comments) || 0,
              date: row.date || new Date().toISOString().split('T')[0],
              views: parseInt(row.views) || 0,
              saves: parseInt(row.saves) || 0,
              engagementRate: parseFloat(row.engagementRate) || 0,
              hashtags: row.hashtags ? String(row.hashtags).split(',').map(tag => tag.trim()) : [],
              contentLength: row.content?.length || 0
            }));
            onDataLoaded(parsedData);
            break;

          case 'json':
            const jsonContent = JSON.parse(content as string);
            parsedData = Array.isArray(jsonContent) ? jsonContent : [jsonContent];
            parsedData = parsedData.map(row => ({
              id: row.id || Math.random().toString(36).substr(2, 9),
              type: validatePostType(row.type),
              content: row.content || '',
              likes: parseInt(row.likes) || 0,
              shares: parseInt(row.shares) || 0,
              comments: parseInt(row.comments) || 0,
              date: row.date || new Date().toISOString().split('T')[0],
              views: parseInt(row.views) || 0,
              saves: parseInt(row.saves) || 0,
              engagementRate: parseFloat(row.engagementRate) || 0,
              hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
              contentLength: row.content?.length || 0
            }));
            onDataLoaded(parsedData);
            break;

          case 'txt':
          case 'md':
            const lines = (content as string).split('\n');
            parsedData = lines
              .filter(line => line.trim())
              .map(line => {
                const [type, content, likes, shares, comments, date, views, saves, engagementRate, hashtags] = line.split('\t');
                return {
                  id: Math.random().toString(36).substr(2, 9),
                  type: validatePostType(type),
                  content: content || '',
                  likes: parseInt(likes) || 0,
                  shares: parseInt(shares) || 0,
                  comments: parseInt(comments) || 0,
                  date: date || new Date().toISOString().split('T')[0],
                  views: parseInt(views) || 0,
                  saves: parseInt(saves) || 0,
                  engagementRate: parseFloat(engagementRate) || 0,
                  hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
                  contentLength: content?.length || 0
                };
              });
            onDataLoaded(parsedData);
            break;

          case 'pdf':
            const pdfData = new Uint8Array(content as ArrayBuffer);
            const pdf = await getDocument({ data: pdfData }).promise;
            let pdfText = '';
            
            // Get text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              pdfText += textContent.items
                .filter((item): item is TextItem => 'str' in item)
                .map(item => item.str)
                .join(' ');
            }

            // Split PDF text into lines and process
            const pdfLines = pdfText.split('\n');
            parsedData = pdfLines
              .filter(line => line.trim())
              .map(line => {
                const [type, content, likes, shares, comments, date, views, saves, engagementRate, hashtags] = line.split('\t');
                return {
                  id: Math.random().toString(36).substr(2, 9),
                  type: validatePostType(type),
                  content: content || '',
                  likes: parseInt(likes) || 0,
                  shares: parseInt(shares) || 0,
                  comments: parseInt(comments) || 0,
                  date: date || new Date().toISOString().split('T')[0],
                  views: parseInt(views) || 0,
                  saves: parseInt(saves) || 0,
                  engagementRate: parseFloat(engagementRate) || 0,
                  hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
                  contentLength: content?.length || 0
                };
              });
            onDataLoaded(parsedData);
            break;

          default:
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please check the file format and try again.');
      }
    };

    if (fileExtension === 'csv') {
      // CSV is handled by Papa.parse directly
      return;
    } else if (fileExtension === 'pdf') {
      reader.readAsArrayBuffer(file);  // Use ArrayBuffer for PDFs
    } else {
      reader.readAsBinaryString(file);
    }
  }, [onDataLoaded]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: SocialMediaPost = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData as Omit<SocialMediaPost, 'id'>
    };
    onDataLoaded([newPost]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
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
            accept=".txt,.md,.csv,.json,.yaml,.yml,.xml,.html,.htm,.pdf,.docx,.py,.sh,.sql,.js,.ts,.tsx,.zip,.xlsx,.xls"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            aria-label="Upload data file"
            title="Upload data file"
          />
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="p-4 bg-emerald-500/10 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-emerald-400">Drop your file here</p>
              <p className="text-sm text-gray-400">or click to browse</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileType size={16} />
              <span>Supported formats: TXT, MD, CSV, JSON, YAML, XML, HTML, PDF, DOCX, PY, SH, SQL, JS, TS, TSX, ZIP, XLSX, XLS</span>
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

          <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-xl transition-all duration-300 group">
            <FileSpreadsheet className="h-5 w-5 text-purple-400" />
            <span className="font-semibold">Download Template</span>
          </button>

          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-400">
                Need help? Check out our guide on how to format your data for the best results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-effect rounded-xl p-6 w-full max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-emerald-400">Add New Post</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Close modal"
                title="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Post ID *</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter post ID"
                    required
                  />
                </div>
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Post Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as SocialMediaPost['type'] })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    aria-label="Post type"
                    title="Select post type"
                >
                  <option value="image">Image</option>
                  <option value="carousel">Carousel</option>
                  <option value="reel">Reel</option>
                  <option value="text">Text</option>
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
                />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Likes *</label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    placeholder="Enter number of likes"
                    title="Number of likes"
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
                    placeholder="Enter number of shares"
                    title="Number of shares"
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
                    placeholder="Enter number of comments"
                    title="Number of comments"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Views</label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    placeholder="Enter number of views"
                    title="Number of views"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Saves</label>
                  <input
                    type="number"
                    value={formData.saves}
                    onChange={(e) => setFormData({ ...formData, saves: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    placeholder="Enter number of saves"
                    title="Number of saves"
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
                    placeholder="Enter engagement rate"
                    title="Engagement rate percentage"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => {
                      const content = e.target.value;
                      setFormData({ 
                        ...formData, 
                        content,
                        contentLength: content?.length ?? 0
                      });
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                    placeholder="Enter post content"
                    title="Post content"
                  />
                  <p className="text-xs text-gray-400 mt-1">Characters: {formData.contentLength}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hashtags</label>
                  <textarea
                    value={formData.hashtags?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value.split(',').map(tag => tag.trim()) })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                    placeholder="Enter hashtags separated by commas"
                    title="Post hashtags"
                />
                  <p className="text-xs text-gray-400 mt-1">Hashtags: {formData.hashtags?.length || 0}</p>
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

      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
    </div>
  );
};