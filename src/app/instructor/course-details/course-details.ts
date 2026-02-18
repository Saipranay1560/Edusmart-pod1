import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {
  togglePublish() {
    this.course.published = !this.course.published;
  }

  activeTab='content';
  newQuestion='';
  option1='';
  option2='';
  option3='';
  option4='';
  correctOption='';
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public courseDetailsService: CourseDetailsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.courseDetailsService.loadCourseById(Number(courseId));
      }
    });
  }


  get course() {
    return this.courseDetailsService.course;
  }
  get quiz() {
    return this.courseDetailsService.quiz;
  }
 
  goBack() {
    this.router.navigate(['/instructor/courses']);
  }
 
  onPdfSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addPdf(file);
    event.target.value = '';
  }

  addQuizQuestion() {
  if (this.newQuestion) {
    const fullQuestion =
      this.newQuestion + ' | ' +
      this.option1 + ', ' +
      this.option2 + ', ' +
      this.option3 + ', ' +
      this.option4;
 
    this.courseDetailsService.quiz.questions.push(fullQuestion);
 
    this.newQuestion = '';
    this.option1 = '';
    this.option2 = '';
    this.option3 = '';
    this.option4 = '';
  }
}
 
  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addVideo(file);
    event.target.value = '';
  }
  expandModuleIndex: number | null = null;
  toggleModule(index: number) {
    if (this.expandModuleIndex === index) {
      this.expandModuleIndex = null;
    } else {
      this.expandModuleIndex = index;
    }
  }
  onAssignmentUpload(event: any) {
  const file: File = event.target.files[0];
 
  if (file) {
    this.courseDetailsService.addAssignment({
      title: file.name,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Uploaded'
    });
  }
 
  event.target.value = '';
}
}