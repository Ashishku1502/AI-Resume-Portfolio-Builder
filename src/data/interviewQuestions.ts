import type { InterviewQuestion } from '@/types/resume';

export const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'b1',
    question: 'Tell me about a time when you had to work under pressure to meet a deadline.',
    type: 'behavioral',
  },
  {
    id: 'b2',
    question: 'Describe a situation where you had to resolve a conflict with a team member.',
    type: 'behavioral',
  },
  {
    id: 'b3',
    question: 'Give me an example of a time when you showed leadership.',
    type: 'behavioral',
  },
  {
    id: 'b4',
    question: 'Tell me about a time when you failed and what you learned from it.',
    type: 'behavioral',
  },
  {
    id: 'b5',
    question: 'Describe a situation where you had to adapt to significant changes.',
    type: 'behavioral',
  },
  {
    id: 'b6',
    question: 'Tell me about a time when you went above and beyond your job responsibilities.',
    type: 'behavioral',
  },
  {
    id: 'b7',
    question: 'Describe a situation where you had to make a difficult decision.',
    type: 'behavioral',
  },
  {
    id: 'b8',
    question: 'Give me an example of how you handled a challenging customer or stakeholder.',
    type: 'behavioral',
  },
];

export const technicalQuestions: InterviewQuestion[] = [
  {
    id: 't1',
    question: 'Design a URL shortening service like bit.ly. Consider scalability, availability, and performance.',
    type: 'technical',
  },
  {
    id: 't2',
    question: 'Design a social media feed system that can handle millions of users.',
    type: 'technical',
  },
  {
    id: 't3',
    question: 'How would you design a distributed cache system?',
    type: 'technical',
  },
  {
    id: 't4',
    question: 'Design a real-time chat application with support for group messaging.',
    type: 'technical',
  },
  {
    id: 't5',
    question: 'How would you design a rate limiting system for an API?',
    type: 'technical',
  },
  {
    id: 't6',
    question: 'Design a notification system that can send emails, SMS, and push notifications.',
    type: 'technical',
  },
];
