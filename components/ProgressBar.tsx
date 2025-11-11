
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const progressPercentage = Math.min(100, Math.max(0, progress));

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-200/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700">Restoring your memory... {Math.round(progressPercentage)}%</p>
    </div>
  );
};
