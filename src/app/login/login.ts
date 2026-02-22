import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService'; 

type Role = 'admin' | 'instructor' | 'student';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  selectedRole: Role = 'student';
  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  selectRole(role: Role) {
    this.selectedRole = role;
  }

  // This helper is what the HTML template is looking for
  hasError(controlName: string, errorCode?: string): boolean {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return false;
    const show = this.submitted || (ctrl.dirty || ctrl.touched);
    return errorCode ? (show && ctrl.hasError(errorCode)) : (show && ctrl.invalid);
  }

  onLogin() {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    
    const loginPayload = {
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.selectedRole
    };

    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        this.loading = false;
        // Save user details to localStorage (fallback if backend does not return user)
        let user = response && response.user;
        if (!user) {
          user = {
            id: response.id || 1, // fallback to 1 if not present
            name: response.name || this.form.value.email.split('@')[0] || 'Student',
            email: response.email || this.form.value.email,
            role: this.selectedRole
          };
        }
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', this.selectedRole);
        const targetMap: Record<string, string> = {
          admin: '/admin/',
          instructor: '/instructor/',
          student: '/student/'
        };
        this.router.navigate([targetMap[this.selectedRole]]);
      },
      error: (err) => {
        this.loading = false;
        alert('Login failed: ' + (err.error?.message || 'Unauthorized'));
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}