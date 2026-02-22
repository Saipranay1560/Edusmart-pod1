import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {

  assignmentTitle: string = '';
  assignmentDueDate: string = '';
  assignmentQuestion: string = '';
  // ================= QUIZ =================
  questions: string[] = [];
  activeTab: string = 'content';
 
  quizQuestion: string = '';
  option1: string = '';
  option2: string = '';
  option3: string = '';
  option4: string = '';
  correctOption: string = '';
 
  // ================= ASSIGNMENT =================
  newAssignmentTitle: string = '';
  newAssignmentSubject: string = '';
  newAssignmentDueDate: string = '';
 
  subjects: string[] = ['Angular', 'Java', 'Spring Boot', 'Database'];
  assignments: any[] = [];
 
  expandModuleIndex: number | null = null;
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public courseDetailsService: CourseDetailsService,
    private sanitizer: DomSanitizer
  ) {}
 
  // ================= INIT =================
  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.courseDetailsService.loadCourseById(Number(courseId));
      }
    });
  }
 
  // ================= GETTERS =================
  get course() {
    return this.courseDetailsService.course;
  }
 
  get quiz() {
    return this.courseDetailsService.quiz;
  }
 
  // ================= NAVIGATION =================
  goBack() {
    this.router.navigate(['/instructor/courses']);
  }
 
  togglePublish() {
    this.course.published = !this.course.published;
  }
 
  // ================= QUIZ =================
  addQuizQuestion() {
 
    if (this.quizQuestion) {
 
      const fullQuestion =
        this.quizQuestion + ' | ' +
        this.option1 + ', ' +
        this.option2 + ', ' +
        this.option3 + ', ' +
        this.option4;
 
      this.courseDetailsService.quiz.questions.push(fullQuestion);
 
      // reset fields
      this.quizQuestion = '';
      this.option1 = '';
      this.option2 = '';
      this.option3 = '';
      this.option4 = '';
      this.correctOption = '';
    }
  }
  addQuestion(){
    this.addQuizQuestion();  }
 
  // ================= PDF =================
  onPdfSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addPdf(file);
    event.target.value = '';
  }
 
  // ================= VIDEO =================
  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addVideo(file);
    event.target.value = '';
  }
 
  // ================= MODULE EXPAND =================
  toggleModule(index: number) {
    if (this.expandModuleIndex === index) {
      this.expandModuleIndex = null;
    } else {
      this.expandModuleIndex = index;
    }
    const providedTitle = (this.newVideoTitle || '').trim();
    const title = providedTitle || `Video ${this.contentVideos.length + 1}`;
    const item = { url, title, description: '', id };
    this.contentVideos.push(item);
    // clear modal inputs
    this.newVideoUrl = '';
    this.newVideoTitle = '';
    this.closeContentModal();
  }
 
  // ================= ASSIGNMENT FORM ADD =================
  addAssignment() {
 
  if (
    !this.assignmentTitle?.trim() ||
    !this.assignmentQuestion?.trim() ||
    !this.assignmentDueDate?.trim()
  ) {
    alert("Please fill all fields");
    return;
  }
 
  this.assignments.push({
    title: this.assignmentTitle,
    question: this.assignmentQuestion,
    dueDate: this.assignmentDueDate
  });
 
  // Clear fields after adding
  this.assignmentTitle = '';
  this.assignmentQuestion = '';
  this.assignmentDueDate = '';
}
 
  // ================= ASSIGNMENT FILE UPLOAD =================
  onAssignmentUpload(event: any) {
    const file: File = event.target.files[0];
 
    if (file) {
      this.courseDetailsService.addAssignment({
        title: file.name,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Uploaded',
         
      });
    }
 
    event.target.value = '';
  }
 
}
