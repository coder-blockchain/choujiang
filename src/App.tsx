import React, { useState } from 'react';
import Setup from './components/Setup';
import Draw from './components/Draw';
import Results from './components/Results';
import { AppState } from './types';
import { Gift } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [participants, setParticipants] = useState<string[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [winners, setWinners] = useState<Record<number, string[]>>({});

  const handleStart = (parts: string[], repeat: boolean) => {
    setParticipants(parts);
    setAllowRepeat(repeat);
    setAppState('draw');
  };

  const handleComplete = (finalWinners: Record<number, string[]>) => {
    setWinners(finalWinners);
    setAppState('results');
  };

  const handleReset = () => {
    setAppState('setup');
    setParticipants([]);
    setWinners({});
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 mr-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">年会幸运抽奖系统</h1>
          </div>
          {appState !== 'setup' && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              返回设置
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {appState === 'setup' && <Setup onStart={handleStart} />}
        {appState === 'draw' && (
          <Draw 
            participants={participants} 
            allowRepeat={allowRepeat} 
            onComplete={handleComplete} 
          />
        )}
        {appState === 'results' && (
          <Results 
            winners={winners} 
            onReset={handleReset} 
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} 年会抽奖系统. All rights reserved.
      </footer>
    </div>
  );
}
