import React from 'react';
import { motion } from 'motion/react';
import { Download, RotateCcw, Trophy, Medal, Award } from 'lucide-react';
import { PRIZES } from '../types';

interface ResultsProps {
  winners: Record<number, string[]>;
  onReset: () => void;
}

export default function Results({ winners, onReset }: ResultsProps) {
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel Chinese support
    csvContent += "奖项,中奖者\n";
    
    // Reverse PRIZES to show 1st prize first in export
    [...PRIZES].reverse().forEach(prize => {
      const pWinners = winners[prize.id] || [];
      pWinners.forEach(winner => {
        csvContent += `${prize.name},${winner}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "年会抽奖结果.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPrizeIcon = (id: number) => {
    switch(id) {
      case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Award className="w-8 h-8 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden p-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">🎉 抽奖结果公布 🎉</h2>
          <p className="text-lg text-gray-500">恭喜所有中奖的幸运儿！</p>
        </div>

        <div className="space-y-8 mb-12">
          {[...PRIZES].reverse().map((prize, index) => {
            const pWinners = winners[prize.id] || [];
            return (
              <motion.div 
                key={prize.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
                  {getPrizeIcon(prize.id)}
                  <h3 className="text-2xl font-bold text-gray-800 ml-3">{prize.name}</h3>
                  <span className="ml-auto text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                    共 {pWinners.length} 名
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pWinners.map((winner, idx) => (
                    <div key={idx} className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 text-center font-semibold text-gray-800 text-lg">
                      {winner}
                    </div>
                  ))}
                  {pWinners.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-4 italic">
                      暂无中奖者
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={exportCSV}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-6 h-6 mr-2" />
            导出结果 (CSV)
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 text-lg font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            重新开始
          </button>
        </div>
      </motion.div>
    </div>
  );
}
