
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { Sparkles, Heart, Skull } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  onCorrect: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, onCorrect }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [wrongIndices, setWrongIndices] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [runawayOffsets, setRunawayOffsets] = useState<{ [key: number]: { x: number, y: number } }>({});

  const handleOptionClick = (isCorrect: boolean, idx: number, msg?: string) => {
    if (isCorrect) {
      setFeedback(null);
      onCorrect();
    } else {
      setFeedback(msg || (question.energy === 'MELODY' ? "Try again my love! 🌸" : "Nice try, dummy! 😈"));
      setIsShaking(true);
      setWrongIndices(prev => [...prev, idx]);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleRunaway = (idx: number) => {
    // Only runaway on non-mobile devices to prevent touch frustration
    if (window.innerWidth > 768 && question.specialBehavior === 'RUNAWAY' && !question.options[idx].isCorrect) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 80;
      setRunawayOffsets(prev => ({ ...prev, [idx]: { x, y } }));
    }
  };

  const isMelody = question.energy === 'MELODY';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        x: isShaking ? [-6, 6, -6, 6, 0] : 0 
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      ref={containerRef}
      className={`max-w-md w-full backdrop-blur-md rounded-[40px] p-6 md:p-8 kawaii-shadow border-2 md:border-4 flex flex-col items-center gap-4 md:gap-6 relative transition-colors duration-500 ${
        isMelody ? 'bg-white/90 border-pink-200' : 'bg-slate-50/90 border-purple-200'
      }`}
    >
      <div className={`absolute -top-10 md:-top-12 p-4 md:p-5 rounded-full border-2 md:border-4 shadow-lg floating transition-colors duration-500 ${
        isMelody ? 'bg-pink-50 border-pink-100 text-pink-400' : 'bg-purple-50 border-purple-100 text-purple-400'
      }`}>
        {isMelody ? <Heart className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" /> : <Skull className="w-10 h-10 md:w-12 md:h-12" />}
      </div>

      <h2 className={`text-xl md:text-3xl font-black text-center mt-6 md:mt-8 leading-tight px-1 ${
        isMelody ? 'text-pink-600' : 'text-purple-600'
      }`}>
        {question.text}
      </h2>

      <div className="flex flex-col gap-3 w-full mt-2 md:mt-4">
        {question.options.map((opt, idx) => (
          <motion.button
            key={idx}
            animate={{ 
              x: runawayOffsets[idx]?.x || 0,
              y: runawayOffsets[idx]?.y || 0,
              scale: wrongIndices.includes(idx) ? 0.9 : 1,
              opacity: wrongIndices.includes(idx) ? 0.7 : 1
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => handleRunaway(idx)}
            onClick={() => handleOptionClick(opt.isCorrect, idx, opt.feedback)}
            className={`py-3 md:py-4 px-5 md:px-6 rounded-[20px] md:rounded-3xl text-md md:text-lg font-black transition-all shadow-sm border-2 ${
              opt.isCorrect 
              ? (isMelody ? 'bg-pink-400 text-white border-pink-300' : 'bg-purple-500 text-white border-purple-400')
              : (isMelody ? 'bg-pink-50 text-pink-400 border-pink-100' : 'bg-purple-50 text-purple-400 border-purple-100')
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>

      <div className="min-h-[20px] md:min-h-[24px]">
        <AnimatePresence mode="wait">
          {feedback ? (
            <motion.p
              key="feedback"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm md:text-base ${isMelody ? 'text-pink-500' : 'text-purple-500'} font-bold text-center italic`}
            >
              {feedback}
            </motion.p>
          ) : question.note && (
            <motion.div 
              key="note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-1 md:gap-2 italic text-[11px] md:text-sm ${isMelody ? 'text-pink-300' : 'text-purple-300'}`}
            >
              <Sparkles size={14} />
              <span>{question.note}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
