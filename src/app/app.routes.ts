import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Student } from './student/student';
import { Instructor } from './instructor/instructor';
import { Admin } from './admin/admin';
import { authGuard } from './auth-guard';
 
export const routes: Routes = [
  { path: '', component: Home },        
  { path: 'login', component: Login },  
 
  {
    path: 'student',
    component: Student,
    canActivate: [authGuard],
    data: { role: 'student' }
  },
  {
    path: 'instructor',
    component: Instructor,
    canActivate: [authGuard],
    data: { role: 'instructor' }
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard],
    data: { role: 'admin' }
  }
];
