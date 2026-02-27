export interface LeaveRequest {
  id?: number;
  studentId: number;
  leaveDate: string;
  reason: string;
  studentName?: string; // Used for GET responses
}
