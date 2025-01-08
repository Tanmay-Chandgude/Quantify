import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { runFlow } from '../utils/langflowClient';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await runFlow(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] glass-effect rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                  : 'bg-gray-800/90 text-gray-100 border border-gray-700'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <Bot size={16} />
                  <span className="font-medium">AI Assistant</span>
                </div>
              )}
              <div
                className={`${
                  message.role === 'assistant' ? 'prose prose-invert max-w-none' : ''
                }`}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line.startsWith('*') ? (
                      <span className="text-emerald-400">{line}</span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/90 rounded-lg p-4 border border-gray-700">
              <Bot className="animate-pulse text-emerald-400" size={20} />
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your social media analytics..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
            aria-label="Send message"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
