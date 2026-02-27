import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentProfileService,StudentProfile as ProfileData } from '../../../services/student-profile';
import { sign } from 'node:crypto';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile implements OnInit {

  user = signal<any>(null);
  loading = signal(true);
  errorMessage: string = '';

  constructor(private profileService: StudentProfileService) { }

  ngOnInit(): void {
    // Retrieve the studentId saved in localStorage during login
    const studentId = JSON.parse(localStorage.getItem('user') || '{}').id;

    if (studentId) {
      this.profileService.getProfileById(+studentId).subscribe({
        next: (data) => {
          this.user.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage = 'Failed to load profile details.';
          this.loading.set(false);
          console.error('Profile Load Error:', err);
        }
      });
    } else {
      this.errorMessage = 'User session not found. Please log in again.';
      this.loading.set(false);
    }
  }
}
