import { Injectable, signal } from '@angular/core';
import {
  Assessment,
  Course,
  FeeItem,
  OverallProgress,
  Subject,
  SubjectProgress,
  QuizResult,
  UserProfile
} from '../shared/';

const LS_KEY = 'edusmart_state_v1';

interface AppState {
  subjects: Subject[];
  courses: Course[];
  fees: FeeItem[];
  assessments: Assessment[];
  results: QuizResult[];
  user: UserProfile;
}

const DEFAULT_USER: UserProfile = {
  userId: 'STU-2025-0001',
  name: 'Saurabh Mittal',
  role: 'STUDENT',
  contactInfo: { email: 'saurabh.mittal@example.edu', phone: '+91-98765-43210' },
  status: 'Active'
};

function defaultState(): AppState {
  const subjects: Subject[] = [
    { id: 'sub-dbms', name: 'Database Management System', code: 'DBMS' },
    { id: 'sub-se', name: 'Software Engineering', code: 'SE' },
    { id: 'sub-os', name: 'Operating Systems', code: 'OS' },
    { id: 'sub-em', name: 'Engineering Mathematics', code: 'EM' },
  ];

  const courses: Course[] = [
    { id: 'c-dbms-101',  description: 'Learn fundamentals of relational databases.', title: 'Relational Databases Fundamentals', credits: 3, enrolled: false },
    { id: 'c-dbms-201', description: 'Advanced SQL and database optimization techniques.', title: 'Advanced SQL & Optimization', credits: 4, enrolled: true,
      schedule: [{ day: 'Mon', time: '10:00-11:30', link: 'https://meet.example.com/dbms' }] },
    { id: 'c-se-101', description: 'Software requirements and UML modeling.', title: 'Requirements & UML', credits: 3, enrolled: false,
      schedule: [{ day: 'Wed', time: '14:00-15:00', link: 'https://meet.example.com/se' }] },
    { id: 'c-os-101',  description: 'Core concepts of operating systems.', title: 'Processes, Threads & Scheduling', credits: 3, enrolled: true },
    { id: 'c-em-101', description: 'Calculus for Engineers.', title: 'Calculus for Engineers', credits: 4, enrolled: false },
  ];

  const fees: FeeItem[] = [
    { id: 'fee-exam-2025', name: 'Exam Fees (Semester IV)', amount: 1500, category: 'exam', paid: false, dueDate: '2026-01-15' },
    { id: 'fee-hostel-2025', name: 'Hostel Fees (Annual)', amount: 25000, category: 'hostel', paid: true, dueDate: '2025-06-30' },
    { id: 'fee-sem-2025', name: 'Semester Fees (2025-26)', amount: 45000, category: 'semester', paid: false, dueDate: '2026-02-10' },
  ];

  const assessments: Assessment[] = [
    {
      id: 'asm-dbms-quiz1',
      subjectId: 'sub-dbms',
      title: 'DBMS MCQ Quiz 1',
      questions: [
        { id: 'q1', text: 'Which normal form removes transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], answerIndex: 2, marks: 2 },
        { id: 'q2', text: 'SQL keyword to combine rows from two tables based on related columns?', options: ['UNION', 'JOIN', 'GROUP BY', 'HAVING'], answerIndex: 1, marks: 2 },
        { id: 'q3', text: 'Primary key ensures:', options: ['Uniqueness', 'Nullability', 'Duplication', 'None'], answerIndex: 0, marks: 2 },
      ],
      maxMarks: 6,
      attempts: 1
    },
    {
      id: 'asm-se-quiz1',
      subjectId: 'sub-se',
      title: 'SE MCQ Quiz 1',
      questions: [
        { id: 'q1', text: 'In Agile, product increments are delivered:', options: ['Annually', 'Monthly', 'Iteratively', 'At project end'], answerIndex: 2, marks: 2 },
        { id: 'q2', text: 'UML diagram for system behavior over time:', options: ['Class', 'Sequence', 'Deployment', 'Component'], answerIndex: 1, marks: 2 },
      ],
      maxMarks: 4,
      attempts: 1
    },
    {
      id: 'asm-os-quiz1',
      subjectId: 'sub-os',
      title: 'OS MCQ Quiz 1',
      questions: [
        { id: 'q1', text: 'Round Robin scheduling uses:', options: ['Priority', 'Time quantum', 'FCFS', 'SJF'], answerIndex: 1, marks: 2 },
        { id: 'q2', text: 'Context switch occurs when:', options: ['Process terminates', 'Interrupt happens', 'I/O completes', 'All of the above'], answerIndex: 3, marks: 2 },
      ],
      maxMarks: 4,
      attempts: 1
    },
    {
      id: 'asm-em-quiz1',
      subjectId: 'sub-em',
      title: 'EM MCQ Quiz 1',
      questions: [
        { id: 'q1', text: 'Derivative of sin(x) is:', options: ['cos(x)', 'sin(x)', '-sin(x)', '-cos(x)'], answerIndex: 0, marks: 2 },
        { id: 'q2', text: '∫ x dx equals:', options: ['x', 'x^2/2', 'ln x', '2x'], answerIndex: 1, marks: 2 },
      ],
      maxMarks: 4,
      attempts: 1
    },
  ];

  return { subjects, courses, fees, assessments, results: [], user: DEFAULT_USER };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private state = signal<AppState>(this.loadState());

  private loadState(): AppState {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const fallback = defaultState();
      const migrated: AppState = {
        subjects: Array.isArray(parsed.subjects) ? parsed.subjects : fallback.subjects,
        courses: Array.isArray(parsed.courses) ? parsed.courses : fallback.courses,
        fees: Array.isArray(parsed.fees) ? parsed.fees : fallback.fees,
        assessments: Array.isArray(parsed.assessments) ? parsed.assessments : fallback.assessments,
        results: Array.isArray(parsed.results) ? parsed.results : [],
        user: parsed.user ? (parsed.user as UserProfile) : DEFAULT_USER,
      };
      localStorage.setItem(LS_KEY, JSON.stringify(migrated));
      return migrated;
    } catch {
      return defaultState();
    }
  }

  private persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.state()));
  }

  getSubjects() { return this.state().subjects; }
  getCourse(id: string) {
    return this.state().courses.find(c => c.id === id);
  }

  getAssessment(id: string) {
    return this.state().assessments.find(a => a.id === id);
  }

  getAttemptCount(assessmentId: string): number {
    return this.state().results.filter(r => r.assessmentId === assessmentId).length;
  }


  // Inside DataService class
toggleEnroll(courseId: string, enroll: boolean) {
  this.state.update(s => ({
    ...s,
    courses: s.courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,

          status: enroll ? 'pending' : 'available',
          enrolled: !enroll ? false : c.enrolled
        };
      }
      return c;
    })
  }));
  this.persist();
}

  getFees() { return this.state().fees; }

  payFee(id: string) {
    this.state.update(s => ({
      ...s,
      fees: s.fees.map(f => f.id === id ? { ...f, paid: true } : f)
    }));
    this.persist();
  }

  getAssessmentsBySubject(subjectId: string) {
    return this.state().assessments.filter(a => a.subjectId === subjectId);
  }

  recordResult(result: QuizResult) {
    this.state.update(s => ({
      ...s,
      results: [...s.results, result]
    }));
    this.persist();
  }

  getSubjectProgress(): SubjectProgress[] {
    const s = this.state();
    return s.subjects.map(sub => {
      const subjectAssessments = s.assessments.filter(a => a.subjectId === sub.id);
      const total = subjectAssessments.length;
      const completed = subjectAssessments.filter(asmt =>
        s.results.some(r => r.assessmentId === asmt.id)
      ).length;
      const percentage = total ? Math.round((completed / total) * 100) : 0;
      return { subjectId: sub.id, completedAssessments: completed, totalAssessments: total, percentage };
    });
  }

  getOverallProgress(): OverallProgress {
    const s = this.state();
    const totalAssessments = s.assessments.length;
    const uniqueCompletedIds = new Set(s.results.map(r => r.assessmentId));
    const totalCompleted = uniqueCompletedIds.size;
    const overallPercentage = totalAssessments ? Math.round((totalCompleted / totalAssessments) * 100) : 0;
    return { overallPercentage, totalCompleted, totalAssessments };
  }

  getUser(): UserProfile { return this.state().user; }

  resetStorage() {
    localStorage.removeItem(LS_KEY);
    this.state.set(defaultState());
    this.persist();
  }
}
