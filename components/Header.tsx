
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
        ReMemory <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">4K</span>
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Breathe new life into your old photos with AI.
      </p>
    </header>
  );
};
