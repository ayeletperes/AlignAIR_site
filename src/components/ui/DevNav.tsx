'use client';

import React from 'react';
import Link from 'next/link';

const DevNav: React.FC = () => {
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-yellow-600 text-black px-4 py-2 text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>🔧 Development Mode</span>
          <Link 
            href="/dev-docs" 
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-3 py-1 rounded-md transition-colors"
          >
            Dev Docs
          </Link>
        </div>
        <div className="text-xs opacity-75">
          This banner only appears in development
        </div>
      </div>
    </div>
  );
};

export default DevNav; 