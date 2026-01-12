export enum AssessmentStatus {
 DRAFT = 'DRAFT',
 PUBLISHED = 'PUBLISHED',
 CLOSED = 'CLOSED'
}
export interface Assessment {
 assessmentId: number;
 title: string;
 course: string;
 type: 'QUIZ' | 'EXAM';
 startDate: string;
 endDate: string;
 maxScore: number;
 status: AssessmentStatus;
 createdBy: string;
}