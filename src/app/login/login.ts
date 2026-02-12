
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Role = 'admin' | 'instructor' | 'student';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Default role
  selectedRole: Role = 'student';

  // Reactive form
  form: FormGroup;

  // UI state
  submitted = false;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Role tabs
  selectRole(role: Role) {
    this.selectedRole = role;
  }

  // Helper to check control errors in template
  hasError(controlName: string, errorCode?: string): boolean {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return false;
    const show = this.submitted || ctrl.touched;
    return show && (errorCode ? ctrl.hasError(errorCode) : ctrl.invalid);
  }


  // Submit handler
  onLogin() {
    this.submitted = true;

    // Mark all as touched to show errors
    this.form.markAllAsTouched();

    // Block navigation when invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    localStorage.setItem('role',this.selectedRole);

    // TODO: Replace with real auth call: AuthService.login(...)
    setTimeout(() => {
      this.loading = false;

      // Navigate based on role AFTER success
      const targetMap: any = {
 admin: '/admin/',
 instructor: '/instructor/',
 student: '/student/'
};
const target = targetMap[this.selectedRole];
if (!target) {
 console.error('Role not selected!');
 return;
}
this.router.navigate([target]);

      this.router.navigate([target]);
    }, 600);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
  abc = 345;
}
// shaurya

//comment added in saurabh branch
