import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Prize, PRIZES } from '../types';
import { Gift, Trophy, ArrowRight, CheckCircle2, Users } from 'lucide-react';

interface DrawProps {
  participants: string[];
  allowRepeat: boolean;
  onComplete: (winners: Record<number, string[]>) => void;
}

export default function Draw({ participants, allowRepeat, onComplete }: DrawProps) {
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [availableParticipants, setAvailableParticipants] = useState<string[]>(participants);
  const [winners, setWinners] = useState<Record<number, string[]>>({ 3: [], 2: [], 1: [] });
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayedName, setDisplayedName] = useState<string>('准备就绪');
  
  const currentPrize = PRIZES[currentPrizeIndex];
  const currentWinners = winners[currentPrize.id] || [];
  const isPrizeComplete = currentWinners.length >= currentPrize.count;

  const drawWinner = () => {
    if (isDrawing) return;
    if (currentWinners.length >= currentPrize.count) return;
    if (availableParticipants.length === 0) {
      alert('没有更多参与者了！');
      return;
    }
    
    setIsDrawing(true);
    let counter = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 50;
    const maxCounter = duration / intervalTime;
    
    // Capture current available participants to prevent stale closures 
    // and avoid React Strict Mode double-invocation issues in state updaters.
    const currentAvailable = availableParticipants;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * currentAvailable.length);
      setDisplayedName(currentAvailable[randomIndex]);
      counter++;
      
      if (counter >= maxCounter) {
        clearInterval(interval);
        
        // Finalize winner
        const finalIndex = Math.floor(Math.random() * currentAvailable.length);
        const winner = currentAvailable[finalIndex];
        
        // Ensure the displayed name exactly matches the finalized winner
        setDisplayedName(winner);
        
        setWinners(w => ({
          ...w,
          [currentPrize.id]: [...(w[currentPrize.id] || []), winner]
        }));
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#818cf8', '#c7d2fe', '#fbbf24', '#f59e0b']
        });
        
        setIsDrawing(false);
        
        if (!allowRepeat) {
          setAvailableParticipants(currentAvailable.filter((_, i) => i !== finalIndex));
        }
      }
    }, intervalTime);
  };

  const handleNext = () => {
    if (currentPrizeIndex < PRIZES.length - 1) {
      setCurrentPrizeIndex(prev => prev + 1);
      setDisplayedName('准备就绪');
    } else {
      onComplete(winners);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Draw Area */}
        <div className="flex-1 p-10 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white relative">
          <div className="absolute top-8 left-8">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold text-sm">
              <Users className="w-4 h-4 mr-2" />
              奖池剩余: {availableParticipants.length} 人
            </div>
          </div>

          <div className="text-center mb-12">
            <motion.h2 
              key={currentPrize.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold text-gray-900 flex items-center justify-center"
            >
              <Trophy className="w-10 h-10 mr-4 text-yellow-500" />
              正在抽取: {currentPrize.name}
            </motion.h2>
            <p className="mt-4 text-lg text-gray-500">
              共 <span className="font-bold text-indigo-600">{currentPrize.count}</span> 名，
              已抽取 <span className="font-bold text-indigo-600">{currentWinners.length}</span> 名
            </p>
          </div>

          <div className="w-full max-w-md bg-white border-4 border-indigo-100 rounded-3xl p-8 shadow-inner mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-50/50"></div>
            <div className="relative z-10 h-32 flex items-center justify-center">
              <div
                className={`text-5xl font-bold text-center transition-colors duration-200 ${isDrawing ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                {displayedName}
              </div>
            </div>
          </div>

          {!isPrizeComplete ? (
            <button
              onClick={drawWinner}
              disabled={isDrawing}
              className={`px-12 py-5 rounded-full text-2xl font-bold text-white shadow-xl transform transition-all ${
                isDrawing 
                  ? 'bg-gray-400 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl'
              }`}
            >
              {isDrawing ? '抽取中...' : '抽取一名'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-5 rounded-full text-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl flex items-center"
            >
              {currentPrizeIndex < PRIZES.length - 1 ? (
                <>下一轮 <ArrowRight className="ml-3 w-6 h-6" /></>
              ) : (
                <>查看结果 <CheckCircle2 className="ml-3 w-6 h-6" /></>
              )}
            </button>
          )}
        </div>

        {/* Right Side - Winners List */}
        <div className="w-full md:w-80 bg-gray-50 border-l border-gray-200 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-indigo-600" />
            中奖名单
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {PRIZES.map(prize => {
              const pWinners = winners[prize.id] || [];
              const isActive = prize.id === currentPrize.id;
              
              return (
                <div key={prize.id} className={`transition-opacity ${isActive || pWinners.length > 0 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${isActive ? 'text-indigo-600' : 'text-gray-700'}`}>
                      {prize.name}
                    </h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {pWinners.length} / {prize.count}
                    </span>
                  </div>
                  
                  {pWinners.length > 0 ? (
                    <ul className="space-y-2">
                      <AnimatePresence>
                        {pWinners.map((winner, idx) => (
                          <motion.li
                            key={`${winner}-${idx}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 text-gray-800 font-medium flex items-center"
                          >
                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-3">
                              {idx + 1}
                            </span>
                            {winner}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-400 italic px-2">虚位以待...</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
