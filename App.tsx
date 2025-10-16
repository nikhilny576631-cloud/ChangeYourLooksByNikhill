
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateStyledImage } from './services/geminiService';

const examplePrompts = [
  'A black leather jacket with a white t-shirt',
  'A formal blue evening gown',
  'Futuristic sci-fi armor',
  'Vintage 1920s flapper dress',
];

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState<number>(Date.now()); // Used to reset the file input

  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and enter a style prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const newImageBase64 = await generateStyledImage(originalImageFile, prompt);
      setGeneratedImageUrl(`data:${originalImageFile.type};base64,${newImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt]);
  
  const handleReset = () => {
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setGeneratedImageUrl(null);
    setPrompt('');
    setIsLoading(false);
    setError(null);
    setKey(Date.now()); // Change key to force re-render of ImageUploader
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    const mimeType = generatedImageUrl.split(';')[0].split(':')[1];
    const extension = mimeType?.split('/')[1] || 'png';
    link.download = `ai-styled-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExamplePromptClick = (p: string) => {
    setPrompt(p);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          AI Fashion Stylist
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Upload a photo, describe an outfit, and let AI create your new look!
        </p>
      </header>

      <main aria-busy={isLoading} className="w-full max-w-5xl flex-grow flex flex-col items-center">
        {!originalImageUrl ? (
          <ImageUploader onImageUpload={handleImageUpload} key={key} />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-3 text-gray-300">Original</h2>
                <img src={originalImageUrl} alt="Original uploaded image" className="rounded-lg shadow-lg w-full max-w-md object-contain" />
              </div>
              <ResultDisplay imageUrl={generatedImageUrl} isLoading={isLoading} prompt={prompt} />
            </div>

            <div className="w-full max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the new outfit, e.g., 'a black leather jacket with a white t-shirt', 'a formal blue evening gown', 'a futuristic sci-fi armor'"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none h-28"
                disabled={isLoading}
                aria-describedby={error ? "prompt-error" : undefined}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400 mb-2">Or try an example:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {examplePrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => handleExamplePromptClick(p)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p id="prompt-error" className="text-red-400 mt-3 text-center">{error}</p>}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                 <button
                  onClick={handleGenerateClick}
                  disabled={isLoading || !prompt}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Styling...' : 'Generate Style'}
                </button>
                {generatedImageUrl && !isLoading && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="w-full max-w-5xl text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Please use responsibly.</p>
      </footer>
    </div>
  );
};

export default App;
