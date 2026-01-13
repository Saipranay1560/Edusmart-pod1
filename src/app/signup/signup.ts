import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrl: './signup.css',

  imports:[ReactiveFormsModule,CommonModule],
})
export class Signup {
 
  signupForm: FormGroup;
  submitted = false;
 
  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator,
    });
  }    
                       
  get f() {
    return this.signupForm.controls;
  }
 
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }
 
  onSubmit() {
    this.submitted = true;
 
    if (this.signupForm.invalid) {
      return;
    }
 
    console.log('Student Registered:', this.signupForm.value);
 
    // TODO: Call backend API here
  }                               
}   