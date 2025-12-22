import { Component } from '@angular/core';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
 
  constructor(private router: Router) {}
 
  loginStudent() {
  localStorage.setItem('role', 'student');
  this.router.navigate(['/student']);
}
 
loginInstructor() {
  localStorage.setItem('role', 'instructor');
  this.router.navigate(['/instructor']);
}
 
loginAdmin() {
  localStorage.setItem('role', 'admin');
  this.router.navigate(['/admin']);
}
}
