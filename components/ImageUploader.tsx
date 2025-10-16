
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };
  
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
      className="w-full max-w-lg mx-auto flex justify-center items-center"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-lg p-8 sm:p-12 text-center border-2 border-dashed border-gray-600 hover:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-300 w-full">
        <div className="flex flex-col items-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-300">
            Click to upload or drag and drop
          </span>
          <span className="block text-xs text-gray-500">
            PNG, JPG, WEBP up to 10MB
          </span>
        </div>
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="sr-only" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange} 
        />
      </label>
    </div>
  );
};
