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
    canActivate: [authGuard],
    // data: { role: 'student' },
    children: [

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
    { path: 'dashboard',canActivate: [authGuard], component: Dashboard },
    { path: 'students',canActivate: [authGuard], component: Students },
    { path: 'attendance',canActivate: [authGuard], component: Attendance },
    { path: 'assignments',canActivate: [authGuard], component: Assignments },
    { path: 'marks',canActivate: [authGuard], component: Marks },
    { path: 'leave-requests',canActivate: [authGuard], component: LeaveRequests },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'courses',canActivate: [authGuard],loadComponent: ()=> import('./instructor/courses/courses').then(m => m.Courses)},
    { path: 'course-details/:id',canActivate: [authGuard],loadComponent:()=> import('./instructor/course-details/course-details').then(m=>m.CourseDetails)}

  ]
},

  {
    path: 'admin',
    canActivate: [authGuard],
    component: Admin,


    children:[

 { path: 'dashboard',canActivate: [authGuard], component: DashboardComponent },
 { path: 'courses',canActivate: [authGuard], component: CoursesComponent },
 { path: 'enrollments',canActivate: [authGuard], component: EnrollmentsComponent },
 { path: 'assessments',canActivate: [authGuard], component: AssessmentsComponent },
 { path: 'reports',canActivate: [authGuard], component: Reports },
 { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

    ]
  }
];
