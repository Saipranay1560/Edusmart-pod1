import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../shared';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-profile.html',
  styleUrls: ['./student-profile.css']
})
export class StudentProfile {

user?: UserProfile;

  constructor(private data: DataService) {
    this.user = this.data.getUser();
  }

 }
