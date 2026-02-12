export interface Subject {
  id: string;
  name: string;
  code: string;
}

export type LearningMode = 'self-paced' | 'instructor-led';

export interface Course {
  id: string;
  subjectId: string;
  title: string;
  mode: LearningMode;
  credits: number;
  enrolled: boolean;
  status?: 'available' | 'pending' | 'enrolled';
  schedule?: { day: string; time: string; link?: string }[];
}

export interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate?: string;
  paid: boolean;
  category: 'exam' | 'hostel' | 'semester';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  marks: number;
}

export interface Assessment {
  id: string;
  subjectId: string;
  title: string;
  questions: Question[];
  maxMarks: number;
  attempts: number;
}

export interface QuizResult {
  assessmentId: string;
  score: number;
  maxMarks: number;
  percentage: number;
  passed: boolean;
  date: string;
}

export interface SubjectProgress {
  subjectId: string;
  completedAssessments: number;
  totalAssessments: number;
  percentage: number;
}

export interface OverallProgress {
  overallPercentage: number;
  totalCompleted: number;
  totalAssessments: number;
}

export interface UserProfile {
  userId: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  contactInfo: {
    email: string;
    phone?: string;
  };
  status: 'Active' | 'Inactive' | 'Suspended';
}
