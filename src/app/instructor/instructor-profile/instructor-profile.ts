import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-profile.html',
  styleUrls: ['./instructor-profile.css']
})
export class InstructorProfile implements OnInit {
  instructor = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');

  constructor(private http: HttpClient) {}

 ngOnInit(): void {
    const instructorId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
    if (instructorId) {
      this.fetchProfile(instructorId);
    } else {
      this.error.set('No instructor session found.'); // Use .set() for signals
      this.loading.set(false);
    }
  }

  fetchProfile(id: string) {
    this.http.get(`http://localhost:1930/api/users/instructor/${id}`)
      .subscribe({
        next: (data) => {
          this.instructor.set(data); // Use .set()
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load profile details.'); // Use .set()
          this.loading.set(false);
        }
      });
  }
}
