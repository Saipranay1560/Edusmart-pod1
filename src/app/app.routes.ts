import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
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
import { ExamManagement } from './student/exam-management/exam-management';
import { Fees } from './student/fees/fees';
import { Progress } from './student/progress/progress';
import { StudentProfile } from './student/student-profile/student-profile';
import { Subjects } from './student/subjects/subjects';
import { VirtualClassroom } from './student/virtual-classroom/virtual-classroom';
import {  CoursesComponent } from './admin/pages/courses/courses';
import { EnrollmentsComponent } from './admin/pages/enrollments/enrollments';
import { AssessmentsComponent } from './admin/pages/assessments/assessments';
import { Reports } from './admin/pages/reports/reports';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';

 
export const routes: Routes = [
  { path: '', component: Home },        
  { path: 'login', component: Login },  
 
  {
    path: 'student',
    component: Student,
    canActivate: [authGuard],
    data: { role: 'student' },
    children:[
      { path:'', redirectTo:'student-profile',pathMatch:'full'},
      { path: 'student-profile', component:StudentProfile},
      { path: 'assessments',loadComponent: ()=> import('./student/assessments/assessments').then(m => m.Assessments)},
      { path: 'assessment-quiz/:id',loadComponent:()=> import('./student/assessment-quiz/assessment-quiz').then(m=>m.AssessmentQuiz)},
      { path: 'exam-management', component:ExamManagement},
      { path: 'fees', component:Fees},
      { path: 'progress', component:Progress},
      { path: 'subjects', component:Subjects},
      { path:'virtual-classroom',component:VirtualClassroom},
      { path: 'courses',loadComponent: ()=> import('./student/courses/courses').then(m => m.Courses)},
      { path: 'course-detail/:id',loadComponent:()=> import('./student/course-detail/course-detail').then(m=>m.CourseDetail)}
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
