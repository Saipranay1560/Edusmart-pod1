import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Student } from './student/student';
import { Instructor } from './instructor/instructor';
import { Admin } from './admin/admin';
import { authGuard } from './auth-guard';
import { LeaveRequestsComponent } from './instructor/leave-requests/leave-requests';
import { StudentProfile } from './student/pages/student-profile/student-profile';
import { CoursesComponent } from './admin/pages/courses/courses';
import { EnrollmentsComponent } from './admin/pages/enrollments/enrollments';
import { AssessmentsComponent } from './admin/pages/assessments/assessments';
import { Reports } from './admin/pages/reports/reports';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';
import { LeaveApplication } from './student/pages/leave-application/leave-application';
import { LoginComponent } from './login/login';
import { Signup } from './signup/signup';
import { ViewQuizInstructor } from './instructor/view-quiz-instructor/view-quiz-instructor';
import { AssignViewSubmissionComponent } from './instructor/assign-view-submission/assign-view-submission';
import { InstructorProfile } from './instructor/instructor-profile/instructor-profile';

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
        path: 'leave-application',
        canActivate: [authGuard],
        component: LeaveApplication
      },
      {
        path: 'view-course/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./student/pages/view-course/view-course').then(m => m.ViewCourse)
      },
      {
        path: 'take-quiz',
        canActivate: [authGuard],
        loadComponent: () => import('./student/pages/take-quiz/take-quiz').then(m => m.TakeQuiz)
      },
      {
        path: 'take-assignment',
        canActivate: [authGuard],
        loadComponent: () => import('./student/pages/take-assignment/take-assignment').then(m => m.TakeAssignment)
      },
    ]
  },
  { path: 'assign-view-submission/:id', component: AssignViewSubmissionComponent },

  {
    path: 'instructor',
    component: Instructor,
    canActivate: [authGuard],
    data: { role: 'instructor' },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', canActivate: [authGuard],component: InstructorProfile },
      { path: 'view-quiz/:id', component: ViewQuizInstructor },
      { path: 'leave-requests', canActivate: [authGuard], component: LeaveRequestsComponent },
      { path: 'quiz-view', canActivate: [authGuard], loadComponent: () => import('./instructor/view-quiz-instructor/view-quiz-instructor').then(m => m.ViewQuizInstructor)},
      {
        path: 'courses',
        canActivate: [authGuard],
        loadComponent: () => import('./instructor/courses/courses').then(m => m.Courses)
      },
      {
        path: 'course-details/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./instructor/course-details/course-details').then(m => m.CourseDetails)
      },
      {
        path: 'quiz-create/:courseId',
        canActivate: [authGuard],
        loadComponent: () => import('./instructor/quiz-create/quiz-create').then(m => m.QuizCreate)
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
