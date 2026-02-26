import React, { useState, useMemo } from 'react';
import { Upload, AlertCircle, Trash2, Users, Play } from 'lucide-react';
import { PRIZES } from '../types';

interface SetupProps {
  onStart: (participants: string[], allowRepeat: boolean) => void;
}

export default function Setup({ onStart }: SetupProps) {
  const [inputText, setInputText] = useState('');
  const [allowRepeat, setAllowRepeat] = useState(false);

  const participants = useMemo(() => {
    return inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
  }, [inputText]);

  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p, (counts.get(p) || 0) + 1);
    });
    return Array.from(counts.entries()).filter(([_, count]) => count > 1).map(([name]) => name);
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(prev => prev ? prev + '\n' + text : text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const removeDuplicates = () => {
    const unique = Array.from(new Set(participants));
    setInputText(unique.join('\n'));
  };

  const handleStart = () => {
    const totalPrizes = PRIZES.reduce((acc, p) => acc + p.count, 0);
    if (!allowRepeat && participants.length < totalPrizes) {
      alert(`人员名单少于获奖总人数（${totalPrizes}人），请添加更多人员或开启“允许重复中奖”！`);
      return;
    }
    if (participants.length === 0) {
      alert('请输入参与抽奖的人员名单！');
      return;
    }
    onStart(participants, allowRepeat);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Users className="mr-3 text-indigo-600" />
          抽奖名单设置
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入名单 (每行一个名字，或用逗号分隔)
            </label>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="张三&#10;李四&#10;王五..."
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                当前共 <span className="font-bold text-indigo-600">{participants.length}</span> 人
              </div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                上传 CSV/TXT
                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">抽奖规则设置</h3>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  checked={allowRepeat}
                  onChange={(e) => setAllowRepeat(e.target.checked)}
                />
                <span className="text-gray-700 font-medium">允许重复中奖</span>
              </label>
              <p className="mt-2 text-sm text-gray-500 ml-8">
                开启后，同一个员工可以多次中奖。关闭则中奖后从名单中移除。
              </p>
            </div>

            {duplicates.length > 0 && (
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">发现重复名单</h3>
                    <p className="mt-1 text-sm text-amber-600">
                      以下人员出现多次：{duplicates.slice(0, 5).join(', ')}{duplicates.length > 5 ? '...' : ''}
                    </p>
                    <button
                      onClick={removeDuplicates}
                      className="mt-3 inline-flex items-center px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-md hover:bg-amber-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      一键删除重复名单
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleStart}
                className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-6 h-6 mr-2" />
                开始年会抽奖
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
