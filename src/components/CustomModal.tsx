import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'select' | 'alert';
  message?: string;
  options?: string[];
  onSelect?: (option: string) => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  message,
  options,
  onSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-emerald-400">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
            title="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {type === 'alert' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-yellow-400">
              <AlertTriangle size={24} />
              <p className="text-gray-300">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              OK
            </button>
          </div>
        )}

        {type === 'select' && options && (
          <div className="space-y-4">
            <p className="text-gray-300">{message}</p>
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect?.(option);
                    onClose();
                  }}
                  className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 