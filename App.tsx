
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Volume2, VolumeX, Sparkles, ArrowRight, Star } from 'lucide-react';
import { BackgroundDecor } from './components/Decorations';
import { QuizCard } from './components/QuizCard';
import { QUESTIONS, COLORS } from './constants';
import { AppState } from './types';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<AppState>('WELCOME');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(false);

  const currentEnergy = useMemo(() => {
    if (gameState === 'WELCOME') return 'MELODY';
    if (gameState === 'QUIZ') return QUESTIONS[currentQuestion].energy;
    if (gameState === 'TEASE') return 'KUROMI';
    return 'MELODY';
  }, [gameState, currentQuestion]);

  const startQuiz = () => setGameState('QUIZ');

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setGameState('TEASE');
    }
  };

  const handleYes = () => {
    setGameState('CELEBRATION');
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 30 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: [COLORS.melodyPink, COLORS.kuromiPurple, '#ffffff']
      });
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-['Fredoka']">
      <BackgroundDecor energy={currentEnergy as 'MELODY' | 'KUROMI'} />

      {/* Floating Audio Toggle */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMusicOn(!isMusicOn)}
          className={`p-3 md:p-4 bg-white/90 rounded-full shadow-lg border-2 flex items-center justify-center transition-colors duration-500 ${
            currentEnergy === 'MELODY' ? 'border-pink-100 text-pink-400' : 'border-purple-100 text-purple-400'
          }`}
        >
          {isMusicOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="z-10 flex flex-col items-center text-center w-full max-w-[90%] md:max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-[40px] md:rounded-[60px] p-8 md:p-12 kawaii-shadow border-4 border-pink-100 relative">
               <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 text-4xl md:text-6xl floating">🎀</div>
               <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 text-4xl md:text-6xl floating" style={{ animationDelay: '1s' }}>🌸</div>
              
              <h1 className="text-3xl md:text-5xl font-black text-pink-500 mb-4 md:mb-6 drop-shadow-sm">
                Hey my favorite person 🎀
              </h1>
              <p className="text-lg md:text-2xl text-gray-600 mb-8 md:mb-10 leading-relaxed font-bold">
                I made something cute... and slightly dangerous 😈💗
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 183, 197, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="bg-pink-400 text-white text-xl md:text-2xl font-black py-4 md:py-6 px-10 md:px-14 rounded-full shadow-xl flex items-center gap-3 transition-colors mx-auto border-b-4 md:border-b-8 border-pink-600 active:border-b-0 active:translate-y-1"
              >
                Continue if you dare 💕
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameState === 'QUIZ' && (
          <motion.div 
            key="quiz-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 w-full flex flex-col items-center px-2"
          >
             <div className="mb-8 md:mb-12 flex gap-2 md:gap-4">
                {QUESTIONS.map((q, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ 
                      width: i === currentQuestion ? (window.innerWidth < 768 ? 30 : 45) : 12,
                      backgroundColor: i === currentQuestion ? (q.energy === 'MELODY' ? COLORS.melodyPink : COLORS.kuromiPurple) : '#e2e8f0'
                    }}
                    className="h-3 md:h-4 rounded-full shadow-inner"
                  />
                ))}
             </div>
             <AnimatePresence mode="wait">
               <QuizCard 
                 key={currentQuestion} 
                 question={QUESTIONS[currentQuestion]} 
                 onCorrect={nextQuestion} 
               />
             </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'TEASE' && (
          <motion.div
            key="tease"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="z-10 text-center w-full max-w-[90%] md:max-w-md"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-[40px] md:rounded-[60px] p-8 md:p-12 kawaii-shadow border-4 md:border-8 border-purple-200">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="text-6xl md:text-8xl mb-6"
               >
                 🥺
               </motion.div>
               <h2 className="text-2xl md:text-3xl font-black text-purple-600 mb-4 leading-tight">
                 Okay okay... last question...
               </h2>
               <p className="text-lg md:text-xl text-purple-400 font-bold italic mb-8">
                 My heart is literally shaking right now 🥺💓
               </p>
               <motion.button
                 onClick={() => setGameState('PROPOSAL')}
                 whileHover={{ scale: 1.1 }}
                 className="bg-purple-500 text-white text-xl md:text-2xl font-black py-4 px-8 rounded-full shadow-lg"
               >
                 I'm ready! 💖
               </motion.button>
            </div>
          </motion.div>
        )}

        {gameState === 'PROPOSAL' && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center w-full max-w-[95%] md:max-w-2xl"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] md:rounded-[80px] p-6 md:p-16 kawaii-shadow border-4 md:border-[12px] border-pink-200 relative">
              <div className="absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
                 <span className="text-4xl md:text-7xl floating">🎀</span>
                 <span className="text-4xl md:text-7xl floating" style={{ animationDelay: '0.5s' }}>💘</span>
                 <span className="text-4xl md:text-7xl floating" style={{ animationDelay: '1s' }}>🎀</span>
              </div>
              
              <h2 className="text-3xl md:text-7xl font-black text-pink-600 mb-8 md:mb-10 drop-shadow-sm leading-tight mt-6 md:mt-0">
                Will you be my Valentine?
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYes}
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-rose-500 text-white text-2xl md:text-4xl font-black py-5 md:py-8 px-8 md:px-16 rounded-[25px] md:rounded-[40px] shadow-2xl border-b-4 md:border-b-[12px] border-rose-700 active:border-b-0 active:translate-y-2"
                >
                  YES 💗
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleYes}
                  className="w-full sm:w-auto bg-white text-pink-500 text-lg md:text-2xl font-black py-5 md:py-8 px-6 md:px-12 rounded-[25px] md:rounded-[40px] shadow-xl border-2 md:border-4 border-pink-100 hover:bg-pink-50"
                >
                  YES but in a cute voice 😳🎀
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'CELEBRATION' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center w-full max-w-[95%] md:max-w-2xl"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] md:rounded-[80px] p-8 md:p-16 kawaii-shadow border-4 border-pink-100 relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="text-6xl md:text-9xl mb-6 md:mb-8"
              >
                🎊
              </motion.div>
              
              <h2 className="text-4xl md:text-8xl font-black text-pink-500 mb-6 md:mb-10">
                YAYYY!! 💖
              </h2>
              
              <div className="space-y-4 md:space-y-6">
                <p className="text-xl md:text-4xl text-gray-700 font-bold leading-relaxed">
                  You’re officially my Valentine 💞
                </p>
                <p className="text-md md:text-2xl text-purple-500 font-black tracking-widest uppercase">
                  Kuromi approved. My Melody blessed.
                </p>
                <motion.p 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-3xl md:text-6xl text-pink-400 font-black"
                >
                  I LOVE YOU 💗
                </motion.p>
              </div>

              <div className="mt-8 md:mt-16 text-sm md:text-lg text-gray-400 font-bold italic leading-relaxed">
                Thank you for choosing me <br className="md:hidden"/> today, tomorrow, and always 🥺💗
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 md:bottom-8 text-pink-300 font-black tracking-[0.2em] md:tracking-[0.3em] opacity-30 z-0 text-[10px] md:text-xs uppercase text-center px-4">
        Sanrio Soulmates Forever 🎀😈
      </footer>
    </div>
  );
};

export default App;
