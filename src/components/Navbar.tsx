import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-emerald-400">Quantify</div>
          {/* Add any navigation items here */}
        </div>
      </div>
    </nav>
  );
}; 