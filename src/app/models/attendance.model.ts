// src/app/models/attendance.model.ts
export interface AttendanceDTO {
  studentId: number;
  studentName?: string; // Optional: used for display in the instructor view
  courseId: number;
  instructorId?: number;
  date?: string;        // Formatted as YYYY-MM-DD
  present: boolean;
}


