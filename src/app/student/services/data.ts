
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

/** Default user used for migration / first load */
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
    { id: 'c-dbms-101', subjectId: 'sub-dbms', title: 'Relational Databases Fundamentals', mode: 'self-paced', credits: 3, enrolled: false },
    { id: 'c-dbms-201', subjectId: 'sub-dbms', title: 'Advanced SQL & Optimization', mode: 'instructor-led', credits: 4, enrolled: true,
      schedule: [{ day: 'Mon', time: '10:00-11:30', link: 'https://meet.example.com/dbms' }] },
    { id: 'c-se-101', subjectId: 'sub-se', title: 'Requirements & UML', mode: 'instructor-led', credits: 3, enrolled: false,
      schedule: [{ day: 'Wed', time: '14:00-15:00', link: 'https://meet.example.com/se' }] },
    { id: 'c-os-101', subjectId: 'sub-os', title: 'Processes, Threads & Scheduling', mode: 'self-paced', credits: 3, enrolled: true },
    { id: 'c-em-101', subjectId: 'sub-em', title: 'Calculus for Engineers', mode: 'self-paced', credits: 4, enrolled: false },
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
      attempts: 0
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
      attempts: 0
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
      attempts: 0
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
      attempts: 0
    },
  ];

  return { subjects, courses, fees, assessments, results: [], user: DEFAULT_USER };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private state = signal<AppState>(this.loadState());

  /** Load from localStorage and migrate schema if needed */
  private loadState(): AppState {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaultState();

      const parsed = JSON.parse(raw) as Partial<AppState>;
      const fallback = defaultState();

      // MIGRATION: ensure every field exists (especially `user`)
      const migrated: AppState = {
        subjects: Array.isArray(parsed.subjects) ? parsed.subjects : fallback.subjects,
        courses: Array.isArray(parsed.courses) ? parsed.courses : fallback.courses,
        fees: Array.isArray(parsed.fees) ? parsed.fees : fallback.fees,
        assessments: Array.isArray(parsed.assessments) ? parsed.assessments : fallback.assessments,
        results: Array.isArray(parsed.results) ? parsed.results : [],
        user: parsed.user ? (parsed.user as UserProfile) : DEFAULT_USER,
      };

      // Persist the migrated shape so subsequent refreshes remain stable
      localStorage.setItem(LS_KEY, JSON.stringify(migrated));
      return migrated;
    } catch {
      return defaultState();
    }
  }

  /** Persist the current state value (not the signal itself) */
  private persist() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.state()));
  }

  // ===== Subjects =====
  getSubjects() { return this.state().subjects; }

  // ===== Courses =====
  getCoursesBySubject(subjectId: string) {
    return this.state().courses.filter(c => c.subjectId === subjectId);
  }
  getCourse(id: string) {
    return this.state().courses.find(c => c.id === id);
  }
  toggleEnroll(courseId: string, enroll: boolean) {
    const s = this.state();
    s.courses = s.courses.map(c => c.id === courseId ? { ...c, enrolled: enroll } : c);
    this.state.set(s); this.persist();
  }

  // ===== Fees =====
  getFees() { return this.state().fees; }
  payFee(id: string) {
    const s = this.state();
    s.fees = s.fees.map(f => f.id === id ? { ...f, paid: true } : f);
    this.state.set(s); this.persist();
  }

  // ===== Assessments & Results =====
  getAssessmentsBySubject(subjectId: string) {
    return this.state().assessments.filter(a => a.subjectId === subjectId);
  }
  getAssessment(id: string) {
    return this.state().assessments.find(a => a.id === id);
  }
  recordResult(result: QuizResult) {
    const s = this.state();
    s.results.push(result);
    s.assessments = s.assessments.map(a => a.id === result.assessmentId ? { ...a, attempts: a.attempts + 1 } : a);
    this.state.set(s); this.persist();
  }
  getResults() { return this.state().results; }

  // ===== Progress =====
  getSubjectProgress(): SubjectProgress[] {
    const s = this.state();
    return s.subjects.map(sub => {
      const total = s.assessments.filter(a => a.subjectId === sub.id).length;
      const completed = s.results.filter(r => s.assessments.find(a => a.id === r.assessmentId)?.subjectId === sub.id).length;
      const percentage = total ? Math.round((completed / total) * 100) : 0;
      return { subjectId: sub.id, completedAssessments: completed, totalAssessments: total, percentage };
    });
  }

  getOverallProgress(): OverallProgress {
    const s = this.state();
    const totalAssessments = s.assessments.length;
    const totalCompleted = s.results.length;
    const overallPercentage = totalAssessments ? Math.round((totalCompleted / totalAssessments) * 100) : 0;
    return { overallPercentage, totalCompleted, totalAssessments };
  }

  // ===== User =====
  getUser(): UserProfile {
    return this.state().user;
  }

  setUser(user: UserProfile) {
    const s = this.state();
    s.user = user;
    this.state.set(s); this.persist();
  }

  /** Dev helper: clear storage and reset to defaults */
  resetStorage() {
    localStorage.removeItem(LS_KEY);
    this.state.set(defaultState());
    this.persist();
  }
}
