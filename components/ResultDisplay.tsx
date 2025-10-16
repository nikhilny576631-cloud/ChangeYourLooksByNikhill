
import React, { useState, useEffect } from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

const loadingMessages = [
  'AI is creating your look...',
  'Consulting the color palette...',
  'Stitching the virtual seams...',
  'Perfecting the pixels...',
  'Adding the finishing touches...',
];

const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (loadingMessages.length > 1) {
      const intervalId = setInterval(() => {
        setMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000); // Change message every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div role="status" className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading, prompt }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-3 text-gray-300">Styled Result</h2>
      <div 
        aria-live="polite"
        className="w-full max-w-md h-auto bg-gray-800 rounded-lg shadow-lg flex items-center justify-center aspect-square"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : imageUrl ? (
          <img src={imageUrl} alt={`Styled result: ${prompt}`} className="rounded-lg object-contain w-full h-full" />
        ) : (
          <div className="text-center text-gray-500 p-4">
            <p>Your styled image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
