import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css']
})
export class CourseDetails implements OnInit {
  newQuestion: string = '';
  questions: string[] = [];
  activeTab = 'content';

  // New Date Properties
  assignmentDueDate: string = '';
  quizDueDate: string = '';

  // Feedback Messages
  assignmentSuccessMessage: string | null = null;

  option1 = '';
  option2 = '';
  option3 = '';
  option4 = '';
  correctOption = '';

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

  togglePublish() {
    this.course.published = !this.course.published;
  }

  // --- Assignment Logic ---
  addQuestion() {
    if (this.newQuestion.trim() !== '') {
      this.questions.push(this.newQuestion);
      this.newQuestion = '';
    }
  }

  deleteAssignmentQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addAssignmentToCourse() {
    // Logic to save questions to the course list using the selected due date
    this.courseDetailsService.addAssignment({
      title: `Assignment ${this.courseDetailsService.assignments.length + 1}`,
      dueDate: this.assignmentDueDate || new Date().toISOString().split('T')[0], // Uses selected date or today
      status: 'Active'
    });

    this.assignmentSuccessMessage = "Assignment has been added successfully!";
    this.questions = [];
    this.assignmentDueDate = ''; // Reset date

    setTimeout(() => {
      this.assignmentSuccessMessage = null;
    }, 3000);
  }

  deleteAssignment(index: number) {
    this.courseDetailsService.assignments.splice(index, 1);
  }

  // --- Quiz Logic ---
addQuizQuestion() {
  if (this.newQuestion) {
    const fullQuestion =
      this.newQuestion + ' | Options: ' +
      this.option1 + ', ' +
      this.option2 + ', ' +
      this.option3 + ', ' +
      this.option4 + ' | Correct: ' + this.correctOption;

    this.courseDetailsService.quiz.questions.push(fullQuestion);

    this.newQuestion = '';
    this.option1 = '';
    this.option2 = '';
    this.option3 = '';
    this.option4 = '';
    this.correctOption = '';
  }
}

deleteQuizQuestion(index: number) {
  this.courseDetailsService.quiz.questions.splice(index, 1);
}

isQuizAdded: boolean = false;

addQuizToPortal() {
  if (this.courseDetailsService.quiz.questions.length > 0) {
    this.isQuizAdded = true;
    const message = this.quizDueDate
      ? `Quiz has been successfully added! Last date to submit: ${this.quizDueDate}`
      : 'Quiz has been successfully added to the Course!';
    alert(message);
  }
}

// New method to handle "Add New Quiz" button
resetQuizForm() {
  this.isQuizAdded = false;
  this.courseDetailsService.quiz.questions = [];
  this.quizDueDate = '';
}

deleteWholeQuiz() {
  if (confirm("Are you sure you want to delete the entire quiz?")) {
    this.resetQuizForm(); // Reuses logic to clear and show form
  }
}
  // --- File Uploads (Resources) ---
  onPdfSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addPdf(file);
    event.target.value = '';
  }

  onVideoSelected(event: any) {
    const file: File = event.target.files[0];
    this.courseDetailsService.addVideo(file);
    event.target.value = '';
  }

  goBack() {
    this.router.navigate(['/instructor/courses']);
  }

  expandModuleIndex: number | null = null;
  toggleModule(index: number) {
    this.expandModuleIndex = this.expandModuleIndex === index ? null : index;
  }
}
