import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-virtual-classroom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './virtual-classroom.html',
  styleUrls: ['./virtual-classroom.css']
})
export class VirtualClassroom {
 
  course = {
    title: 'Angular Fundamentals',
    instructor: 'Mr. Kumar',
    meetingLink: 'https://meet.google.com/demo-link',
    schedule: 'Mon & Wed - 10:00 AM',
    status: 'Live'
  };
 
  materials = [
    { name: 'Angular Introduction.pdf', type: 'PDF' },
    { name: 'Components & Templates.mp4', type: 'Video' },
    { name: 'Assignment 1.pdf', type: 'PDF' }
  ];
 
}