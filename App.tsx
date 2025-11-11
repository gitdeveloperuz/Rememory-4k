
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { restoreImage } from './services/geminiService';
import { ImageComparator } from './components/ImageComparator';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { AlertTriangle, Download, RotateCcw, Image as ImageIcon } from './components/Icons';


type AppState = 'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

export default function App() {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('IDLE');
  
  const isLoading = appState === 'PROCESSING';

  const originalImageUrl = useMemo(() => {
    if (originalImageFile) {
      return URL.createObjectURL(originalImageFile);
    }
    return null;
  }, [originalImageFile]);

  useEffect(() => {
    let timer: number;
    if (isLoading) {
      setProgress(0);
      let currentProgress = 0;
      timer = window.setInterval(() => {
        currentProgress += Math.random() * 10;
        if (currentProgress > 95) {
            currentProgress = 95;
             window.clearInterval(timer);
        }
        setProgress(currentProgress);
      }, 500);
    }
    return () => {
      window.clearInterval(timer);
    };
  }, [isLoading]);


  const handleImageUpload = useCallback((file: File) => {
    setOriginalImageFile(file);
    setRestoredImageUrl(null);
    setError(null);
    setPrompt('');
    setAppState('UPLOADING');
  }, []);

  const handleRestore = useCallback(async () => {
    if (!originalImageFile) return;

    setAppState('PROCESSING');
    setError(null);

    try {
      const restoredBase64 = await restoreImage(originalImageFile, prompt);
      const mimeType = originalImageFile.type;
      setRestoredImageUrl(`data:${mimeType};base64,${restoredBase64}`);
      setProgress(100);
      setAppState('DONE');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to restore image. ${errorMessage}`);
      setAppState('ERROR');
    }
  }, [originalImageFile, prompt]);

  const handleReset = useCallback(() => {
    setOriginalImageFile(null);
    setRestoredImageUrl(null);
    setError(null);
    setPrompt('');
    setProgress(0);
    setAppState('IDLE');
  }, []);

  const handleDownload = useCallback(() => {
    if (!restoredImageUrl) return;
    const link = document.createElement('a');
    link.href = restoredImageUrl;
    const fileName = originalImageFile?.name.split('.')[0] || 'restored_image';
    link.download = `${fileName}_restored.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [restoredImageUrl, originalImageFile]);
  
  const renderContent = () => {
    switch (appState) {
      case 'IDLE':
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case 'UPLOADING':
      case 'PROCESSING':
      case 'DONE':
      case 'ERROR':
        return (
          <div className="w-full flex flex-col items-center">
            {appState === 'DONE' && restoredImageUrl && originalImageUrl ? (
              <ImageComparator before={originalImageUrl} after={restoredImageUrl} />
            ) : (
               <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center justify-items-center">
                  <div className="w-full aspect-square bg-gray-100/80 rounded-lg flex items-center justify-center p-2 border border-dashed">
                      {originalImageUrl && <img src={originalImageUrl} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />}
                  </div>
                  <div className="w-full aspect-square bg-gray-100/80 rounded-lg flex items-center justify-center p-2 border border-dashed relative overflow-hidden">
                      {isLoading && <ProgressBar progress={progress} />}
                      {appState !== 'PROCESSING' && !restoredImageUrl && <ImageIcon className="w-16 h-16 text-gray-400" />}
                      {restoredImageUrl && <img src={restoredImageUrl} alt="Restored" className="max-w-full max-h-full object-contain rounded-md" />}
                  </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
                <AlertTriangle className="w-5 h-5 mr-3"/>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="w-full mt-6 flex flex-col md:flex-row items-center gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Optional: add warm tones, fix scratches..."
                className="flex-grow w-full md:w-auto bg-white/70 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                disabled={isLoading}
              />
              {appState !== 'DONE' && (
                 <Button onClick={handleRestore} disabled={isLoading}>
                    {isLoading ? 'Restoring...' : 'Restore Image'}
                 </Button>
              )}
            </div>

            <div className="mt-4 w-full flex flex-wrap justify-center items-center gap-4">
               {appState === 'DONE' && (
                  <>
                    <Button onClick={handleDownload} variant="secondary">
                        <Download className="w-5 h-5 mr-2" /> Download
                    </Button>
                    <Button onClick={handleRestore} disabled={isLoading}>
                      {isLoading ? 'Restoring...' : 'Restore Again'}
                    </Button>
                  </>
                )}
               <Button onClick={handleReset} variant="secondary" disabled={isLoading}>
                  <RotateCcw className="w-5 h-5 mr-2" /> Start Over
               </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8 w-full bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/80 p-6 md:p-10 flex flex-col items-center">
          {renderContent()}
        </main>
         <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Gemini AI. Designed for memories.</p>
        </footer>
      </div>
    </div>
  );
}
