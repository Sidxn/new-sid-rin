
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cloud = ({ delay, top, left, scale }: { delay: number, top: string, left: string, scale: number }) => (
  <motion.div
    initial={{ x: -200, opacity: 0 }}
    animate={{ x: '110vw', opacity: 0.4 }}
    transition={{ duration: 60, repeat: Infinity, delay, ease: "linear" }}
    className="absolute pointer-events-none z-0"
    style={{ top, left, scale }}
  >
    <svg width="150" height="100" viewBox="0 0 120 80" fill="white">
      <circle cx="30" cy="50" r="25" />
      <circle cx="60" cy="40" r="30" />
      <circle cx="90" cy="50" r="25" />
      <rect x="30" y="50" width="60" height="25" />
    </svg>
  </motion.div>
);

const TrailItem: React.FC<{ x: number, y: number, emoji: string }> = ({ x, y, emoji }) => (
  <motion.div
    initial={{ opacity: 1, scale: 0.5, y: 0 }}
    animate={{ opacity: 0, scale: 1.5, y: -80, rotate: Math.random() * 360 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="fixed pointer-events-none text-xl md:text-2xl z-50 drop-shadow-sm"
    style={{ left: x, top: y }}
  >
    {emoji}
  </motion.div>
);

export const BackgroundDecor = ({ energy }: { energy: 'MELODY' | 'KUROMI' }) => {
  const [trail, setTrail] = useState<{ id: number, x: number, y: number, emoji: string }[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const emojis = energy === 'MELODY' ? ['🌸', '🎀', '💖', '🍭'] : ['😈', '💀', '💜', '🖤', '🎀'];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      if (dist > 50) {
        const id = Date.now();
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        setTrail(prev => [...prev.slice(-8), { id, x: e.clientX - 10, y: e.clientY - 10, emoji }]);
        lastPos.current = { x: e.clientX, y: e.clientY };
        
        setTimeout(() => {
          setTrail(prev => prev.filter(t => t.id !== id));
        }, 1200);
      }
    };
    
    // Add touch support for trail
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - lastPos.current.x, touch.clientY - lastPos.current.y);
      if (dist > 50) {
        const id = Date.now();
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        setTrail(prev => [...prev.slice(-8), { id, x: touch.clientX - 10, y: touch.clientY - 10, emoji }]);
        lastPos.current = { x: touch.clientX, y: touch.clientY };
        
        setTimeout(() => {
          setTrail(prev => prev.filter(t => t.id !== id));
        }, 1200);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [energy, emojis]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-1000 ${
      energy === 'MELODY' ? 'bg-[#FFF0F3]' : 'bg-[#F7F0FF]'
    }`}>
      <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 bg-gradient-to-br ${
        energy === 'MELODY' 
        ? 'from-[#FFB7C5] to-[#FFD1DC]' 
        : 'from-[#B19CD9] to-[#D8B4FE]'
      }`} />

      {/* Moving Clouds */}
      <Cloud top="5%" left="-10%" delay={0} scale={1} />
      <Cloud top="35%" left="-15%" delay={10} scale={1.2} />
      <Cloud top="75%" left="-20%" delay={5} scale={0.8} />
      
      {/* Trail Elements */}
      <AnimatePresence>
        {trail.map(t => (
          <TrailItem key={t.id} x={t.x} y={t.y} emoji={t.emoji} />
        ))}
      </AnimatePresence>
      
      {/* Thematic Elements - Reduced for mobile to avoid crowding */}
      {energy === 'MELODY' ? (
        <>
          <div className="absolute top-12 left-4 md:left-12 text-4xl md:text-6xl opacity-20 floating">🎀</div>
          <div className="absolute bottom-24 right-4 md:right-16 text-4xl md:text-6xl opacity-20 floating" style={{ animationDelay: '1s' }}>🌸</div>
        </>
      ) : (
        <>
          <div className="absolute top-16 right-4 md:right-16 text-4xl md:text-6xl opacity-20 floating">😈</div>
          <div className="absolute bottom-20 left-4 md:left-12 text-4xl md:text-6xl opacity-20 floating" style={{ animationDelay: '1.5s' }}>💀</div>
        </>
      )}

      {/* Ornamental Frame - Responsive thickness */}
      <div className={`absolute inset-0 border-[10px] md:border-[20px] pointer-events-none rounded-[30px] md:rounded-[50px] m-2 md:m-4 transition-colors duration-1000 ${
        energy === 'MELODY' ? 'border-pink-200/20' : 'border-purple-200/20'
      }`} />
    </div>
  );
};
