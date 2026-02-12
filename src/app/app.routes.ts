import { Routes } from '@angular/router';
import { Home } from './home/home';

import { Student } from './student/student';
import { Instructor } from './instructor/instructor';
import { Admin } from './admin/admin';
import { authGuard } from './auth-guard';
import { LeaveRequests } from './instructor/leave-requests/leave-requests';
import { Marks } from './instructor/marks/marks';
import { Assignments } from './instructor/assignments/assignments';
import { Attendance } from './instructor/attendance/attendance';
import { Students } from './instructor/students/students';
import { Dashboard } from './instructor/dashboard/dashboard';
//import { ExamManagement } from './student/pages/exam-management/exam-management';
import { Fees } from './student/pages/fees/fees';
//import { Progress } from './student/pages/progress/progress';
import { StudentProfile } from './student/pages/student-profile/student-profile';
//import { Subjects } from './student/pages/subjects/subjects';
import {  CoursesComponent } from './admin/pages/courses/courses';
import { EnrollmentsComponent } from './admin/pages/enrollments/enrollments';
import { AssessmentsComponent } from './admin/pages/assessments/assessments';
import { Reports } from './admin/pages/reports/reports';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';
import { LeaveApplication } from './student/pages/leave-application/leave-application';
import { LoginComponent } from './login/login';
import { Signup } from './signup/signup';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: Signup },
  {
    path: 'student',
    component: Student,
    data: { role: 'student' },
    children: [
      // CHANGE THIS LINE: Redirect to courses instead of student-profile
      { path: '', redirectTo: 'student-profile', pathMatch: 'full' },

      { path: 'courses', loadComponent: () => import('./student/pages/courses/courses').then(m => m.Courses) },
      { path: 'student-profile', component: StudentProfile },
      { path: 'assessment-quiz/:id', loadComponent: () => import('./student/pages/assessment-quiz/assessment-quiz').then(m => m.AssessmentQuiz) },
      { path: 'course-detail/:id', loadComponent: () => import('./student/pages/course-detail/course-detail').then(m => m.CourseDetail) },
      { path: 'fees', component: Fees },
      { path: 'leave-application', component: LeaveApplication },
    ]
  },

  {
  path: 'instructor',
  component: Instructor,

  children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'students', component: Students },
    { path: 'attendance', component: Attendance },
    { path: 'assignments', component: Assignments },
    { path: 'marks', component: Marks },
    { path: 'leave-requests', component: LeaveRequests },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'courses',loadComponent: ()=> import('./instructor/courses/courses').then(m => m.Courses)},
    { path: 'course-details/:id',loadComponent:()=> import('./instructor/course-details/course-details').then(m=>m.CourseDetails)}

  ]
},

  {
    path: 'admin',
    component: Admin,


    children:[

 { path: 'dashboard', component: DashboardComponent },
 { path: 'courses', component: CoursesComponent },
 { path: 'enrollments', component: EnrollmentsComponent },
 { path: 'assessments', component: AssessmentsComponent },
 { path: 'reports', component: Reports },
 { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

    ]
  }
];
