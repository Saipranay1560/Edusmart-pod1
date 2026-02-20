import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Student } from './student/student';
import { Instructor } from './instructor/instructor';
import { Admin } from './admin/admin';
import { authGuard } from './auth-guard';
import { LeaveRequests } from './instructor/leave-requests/leave-requests';
import { Marks } from './instructor/marks/marks';
import { Attendance } from './instructor/attendance/attendance';
import { Students } from './instructor/students/students';
import { Dashboard } from './instructor/dashboard/dashboard';
import { Fees } from './student/pages/fees/fees';
import { StudentProfile } from './student/pages/student-profile/student-profile';
import { CoursesComponent } from './admin/pages/courses/courses';
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
      { 
        path: 'courses', 
        canActivate: [authGuard], 
        loadComponent: () => import('./student/pages/courses/courses').then(m => m.Courses) 
      },
      { 
        path: 'student-profile', 
        canActivate: [authGuard], 
        component: StudentProfile 
      },
      { 
        path: 'assessment-quiz/:id', 
        canActivate: [authGuard], 
        loadComponent: () => import('./student/pages/assessment-quiz/assessment-quiz').then(m => m.AssessmentQuiz) 
      },
      { 
        path: 'course-detail/:id', 
        canActivate: [authGuard], 
        loadComponent: () => import('./student/pages/course-detail/course-detail').then(m => m.CourseDetail) 
      },
      { 
        path: 'fees', 
        canActivate: [authGuard], 
        component: Fees 
      },
      { 
        path: 'leave-application', 
        canActivate: [authGuard], 
        component: LeaveApplication 
      },
    ]
  },

  {
    path: 'instructor',
    component: Instructor,
    canActivate: [authGuard],
    data: { role: 'instructor' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', canActivate: [authGuard], component: Dashboard },
      { path: 'students', canActivate: [authGuard], component: Students },
      { path: 'attendance', canActivate: [authGuard], component: Attendance },
      { path: 'marks', canActivate: [authGuard], component: Marks },
      { path: 'leave-requests', canActivate: [authGuard], component: LeaveRequests },
      { 
        path: 'courses', 
        canActivate: [authGuard], 
        loadComponent: () => import('./instructor/courses/courses').then(m => m.Courses) 
      },
      { 
        path: 'course-details/:id', 
        canActivate: [authGuard], 
        loadComponent: () => import('./instructor/course-details/course-details').then(m => m.CourseDetails) 
      }
    ]
  },

  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard],
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent },
      { path: 'courses', canActivate: [authGuard], component: CoursesComponent },
      { path: 'enrollments', canActivate: [authGuard], component: EnrollmentsComponent },
      { path: 'assessments', canActivate: [authGuard], component: AssessmentsComponent },
      { path: 'reports', canActivate: [authGuard], component: Reports },
    ]
  }
];