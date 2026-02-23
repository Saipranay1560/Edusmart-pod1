import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseDetailsService } from '../../../services/course-details';

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

  // Content (YouTube) properties
  contentVideos: Array<{ url: string; title: string; description?: string; id?: string }> = [];
  newVideoTitle: string = '';
  newVideoUrl: string = '';
  showContentModal: boolean = false;

  // New Date Properties
  assignmentDueDate: string = '';
  quizDueDate: string = '';

  // Feedback Messages
  assignmentSuccessMessage: string | null = null;

  // Assignment modal state
  showAssignmentModal: boolean = false;
  editingAssignmentIndex: number | null = null;
  assignForm: { title: string; dueDate: string; description: string; status: string } = {
    title: '',
    dueDate: '',
    description: '',
    status: 'Active'
  };

  option1 = '';
  option2 = '';
  option3 = '';
  option4 = '';
  correctOption = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseDetailsService: CourseDetailsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
    });
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

    this.assignmentSuccessMessage = "Assignment has been added successfully!";
    this.questions = [];
    this.assignmentDueDate = ''; // Reset date

    setTimeout(() => {
      this.assignmentSuccessMessage = null;
    }, 3000);
  }


  // Assignment modal handlers
  openAssignmentModal(index?: number) {

    this.editingAssignmentIndex = null;
    this.assignForm = { title: '', dueDate: '', description: '', status: 'Active' };
    this.showAssignmentModal = true;
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.editingAssignmentIndex = null;
  }

  saveAssignment() {
    const payload = {
      title: (this.assignForm.title || '').trim(),
      dueDate: this.assignForm.dueDate || new Date().toISOString().split('T')[0],
      description: this.assignForm.description || '',
      status: this.assignForm.status || 'Active'
    };

    this.closeAssignmentModal();
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



    this.newQuestion = '';
    this.option1 = '';
    this.option2 = '';
    this.option3 = '';
    this.option4 = '';
    this.correctOption = '';
  }
}



isQuizAdded: boolean = false;

addQuizToPortal() {
    this.isQuizAdded = true;
    const message = this.quizDueDate
      ? `Quiz has been successfully added! Last date to submit: ${this.quizDueDate}`
      : 'Quiz has been successfully added to the Course!';
    alert(message);
}

// New method to handle "Add New Quiz" button
resetQuizForm() {
  this.isQuizAdded = false;
  this.quizDueDate = '';
}

deleteWholeQuiz() {
  if (confirm("Are you sure you want to delete the entire quiz?")) {
    this.resetQuizForm(); // Reuses logic to clear and show form
  }
}
  // --- Content (YouTube) Logic ---
  addContentVideo() {
    const url = (this.newVideoUrl || '').trim();
    if (!url) return;
    const id = this.extractYoutubeId(url);
    if (!id) {
      alert('Please enter a valid YouTube URL.');
      return;
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

  openContentModal() {
    this.showContentModal = true;
  }

  closeContentModal() {
    this.showContentModal = false;
  }

  removeContentVideo(index: number) {
    this.contentVideos.splice(index, 1);
  }

  getEmbedUrl(urlOrItem: string | { url: string }): SafeResourceUrl {
    const url = typeof urlOrItem === 'string' ? urlOrItem : urlOrItem.url;
    const id = this.extractYoutubeId(url);
    const embed = id ? `https://www.youtube.com/embed/${id}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

  private extractYoutubeId(url: string): string | null {
    if (!url) return null;
    // handle common youtube url formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([\w-]{11})/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) return m[1];
    }
    // try to extract last 11 chars if looks like id
    const maybeId = url.split(/[\?&=\/]/).pop();
    return maybeId && maybeId.length === 11 ? maybeId : null;
  }

  goBack() {
    this.router.navigate(['/instructor/courses']);
  }

  navigateToCreateQuiz() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.router.navigate(['/instructor/quiz-create', courseId]);
    }
  }

  expandModuleIndex: number | null = null;
  toggleModule(index: number) {
    this.expandModuleIndex = this.expandModuleIndex === index ? null : index;
  }
}
