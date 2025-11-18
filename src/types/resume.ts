export interface Profile {
  fullName: string;
  currentTitle: string;
  email: string;
  location: string;
  workExperience: string;
  projects: string;
  skills: string;
  education?: string;
  resumeText?: string;
}

export interface GenerationOptions {
  targetRole: string;
  tone: 'Professional' | 'Confident' | 'Friendly';
}

export interface ResumeContent {
  professionalSummary: string;
  experience: string;
  projects: string;
  skills: string;
  education: string;
}

export interface CoverLetterContent {
  content: string;
  keyAchievements: string[];
}

export interface LinkedInContent {
  headline: string;
  about: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical';
}

export interface InterviewEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  rewrittenAnswer: string;
}

export type ToneType = 'Professional' | 'Confident' | 'Friendly';
