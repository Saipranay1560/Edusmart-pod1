import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Add this
import { AuthService } from '../services/AuthService'; // Add this

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  standalone: true, // Ensure standalone is true if you're using it this way
  imports: [ReactiveFormsModule, CommonModule],
})
export class Signup {
  signupForm: FormGroup;
  submitted = false;
  loading = false; // Add loading state

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, // Inject Service
    private router: Router // Inject Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator,
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...signupData } = this.signupForm.value;

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Registration Successful! Please log in.');
        this.router.navigate(['/login']); // Redirect to login
      },
      error: (err) => {
        this.loading = false;
        console.error('Signup Error:', err);
        // Map common server errors to friendly messages
        if (err.status === 409) {
          alert('This email is already registered. Please log in or use another email.');
        } else if (err.status === 400) {
          alert(err.error?.message || 'Invalid signup data. Please check your input.');
        } else if (err.status === 403) {
          alert('Registration is forbidden. Please contact the administrator.');
        } else {
          alert(err.error?.message || 'Registration failed. Please try again later.');
        }
      }
    });
  }
}