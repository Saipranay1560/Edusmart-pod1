export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  name?: string; // alias for template compatibility
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Pending';
}

export interface AttendanceHistory {
  studentId: number;
  studentName: string;
  records: AttendanceRecord[];
}
