
import React, { useState, useCallback } from 'react';
import { UploadCloud } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const dropzoneClasses = `relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
    ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-105' : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50'}`;

  return (
    <label
      htmlFor="file-upload"
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-16 w-16 text-gray-400" />
        <p className="mt-5 text-xl font-semibold text-gray-700">
          Drag & drop your photo here
        </p>
        <p className="mt-1 text-sm text-gray-500">
          or <span className="font-medium text-blue-600">click to browse</span>
        </p>
        <p className="mt-4 text-xs text-gray-500">PNG or JPG files supported</p>
      </div>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
      />
    </label>
  );
};
