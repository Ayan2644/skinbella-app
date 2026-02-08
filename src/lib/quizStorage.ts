import { QuizQuestion, quizQuestions } from './quizData';

const QUIZ_KEY = 'skinbella.quiz.custom';

export const quizStorage = {
  /** Get custom quiz questions, or null if none saved (use defaults) */
  getQuestions: (): QuizQuestion[] | null => {
    try {
      const v = localStorage.getItem(QUIZ_KEY);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },

  /** Get the active quiz questions — custom if saved, otherwise defaults */
  getActiveQuestions: (): QuizQuestion[] => {
    return quizStorage.getQuestions() ?? quizQuestions;
  },

  /** Save custom quiz questions */
  saveQuestions: (questions: QuizQuestion[]) => {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(questions));
  },

  /** Reset to defaults */
  resetToDefaults: () => {
    localStorage.removeItem(QUIZ_KEY);
  },

  /** Check if using custom questions */
  isCustom: (): boolean => {
    return localStorage.getItem(QUIZ_KEY) !== null;
  },
};
