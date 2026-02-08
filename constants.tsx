
import { Question } from './types';

export const COLORS = {
  melodyPink: '#FFB7C5',
  kuromiPurple: '#B19CD9',
  kuromiBlack: '#2D2D2D',
  cream: '#FFFDD0',
  mint: '#BFFCC6',
  peach: '#FFDAB9',
  heart: '#FF6B81',
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What makes my days sweeter? 🌸",
    energy: 'MELODY',
    options: [
      { label: "Chocolate 🍫", isCorrect: false, feedback: "Yummy, but try again! 🥺" },
      { label: "Sunshine ☀️", isCorrect: false, feedback: "Bright, but not bright enough! 🌸" },
      { label: "You 💗", isCorrect: true }
    ],
    note: "You're the sugar in my life! ✨"
  },
  {
    id: 2,
    text: "What happens if you don't pick the right answer? 😈",
    energy: 'KUROMI',
    specialBehavior: 'RUNAWAY',
    options: [
      { label: "Nothing 🖤", isCorrect: false },
      { label: "I cry a little 🥺", isCorrect: false },
      { label: "Click 'Me' if you dare! 😈", isCorrect: true }
    ],
    note: "Mischief managed! 🖤"
  },
  {
    id: 3,
    text: "How serious is my love for you? 💜",
    energy: 'KUROMI',
    options: [
      { label: "Very serious", isCorrect: false, feedback: "Higher! 😤" },
      { label: "Dangerously serious", isCorrect: false, feedback: "Almost... 😳" },
      { label: "Call-the-police serious! 😳💞", isCorrect: true }
    ],
    note: "It's a love crime! 🚔💖"
  }
];
