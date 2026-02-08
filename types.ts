
export interface Question {
  id: number;
  text: string;
  options: Option[];
  note?: string;
  energy: 'MELODY' | 'KUROMI';
  specialBehavior?: 'RUNAWAY';
}

export interface Option {
  label: string;
  isCorrect: boolean;
  feedback?: string;
}

export type AppState = 'WELCOME' | 'QUIZ' | 'TEASE' | 'PROPOSAL' | 'CELEBRATION';
