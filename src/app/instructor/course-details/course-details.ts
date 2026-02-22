import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details';
import { QuizService } from '../../services/quiz-service';
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
  newQuestion: string = '';
  questions: string[] = [];
  activeTab = 'content';

  // Quiz reactive state using signals - support multiple quizzes
  quizzesList = signal<Array<{
    id?: any;
    title: string;
    description: string;
    questions: string[];
  }>>([]);

  hasQuizzes = computed(() => this.quizzesList().length > 0);

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
    public courseDetailsService: CourseDetailsService,
    private sanitizer: DomSanitizer,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        this.courseDetailsService.loadCourseById(Number(courseId));
        // load quiz data for this course from backend
        this.loadQuizzes(Number(courseId));
      }
    });
    
    // Also refresh quiz data when route activates (e.g., after returning from quiz-create)
    this.route.queryParams.subscribe(() => {
      const courseId = Number(this.route.snapshot.paramMap.get('id'));
      if (courseId) {
        this.loadQuizzes(courseId);
      }
    });
  }

  refreshQuizzes() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.loadQuizzes(courseId);
    }
  }

  private loadQuizzes(courseId: number) {
    this.quizService.getQuizzes(courseId).subscribe(
      (res: any) => {
        const quizzes: any[] = [];
        
        // Normalize response to array of quizzes
        if (!res) {
          this.quizzesList.set([]);
          return;
        }

        if (Array.isArray(res)) {
          // Backend returns array of quizzes
          quizzes.push(...res);
        } else if (typeof res === 'object') {
          // Single quiz object
          quizzes.push(res);
        }

        // Map each quiz to normalized format
        const normalizedQuizzes = quizzes.map((quiz: any) => ({
          id: quiz.id || quiz.quizId,
          title: quiz.title || quiz.questionTitle || 'Quiz',
          description: quiz.description || quiz.desc || '',
          questions: Array.isArray(quiz.questions) ? quiz.questions : []
        }));

        this.quizzesList.set(normalizedQuizzes);
      },
      (err) => {
        console.error('Failed to load quizzes for course', courseId, err);
        this.quizzesList.set([]);
      }
    );
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

  // Assignment modal handlers
  openAssignmentModal(index?: number) {
    if (typeof index === 'number') {
      const a = this.courseDetailsService.assignments[index];
      if (a) {
        this.editingAssignmentIndex = index;
        this.assignForm = {
          title: a.title || '',
          dueDate: a.dueDate || '',
          description: (a as any).description || '',
          status: a.status || 'Active'
        };
      }
    } else {
      this.editingAssignmentIndex = null;
      this.assignForm = { title: '', dueDate: '', description: '', status: 'Active' };
    }
    this.showAssignmentModal = true;
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.editingAssignmentIndex = null;
  }

  saveAssignment() {
    const payload = {
      title: (this.assignForm.title || '').trim() || `Assignment ${this.courseDetailsService.assignments.length + 1}`,
      dueDate: this.assignForm.dueDate || new Date().toISOString().split('T')[0],
      description: this.assignForm.description || '',
      status: this.assignForm.status || 'Active'
    };

    if (this.editingAssignmentIndex !== null && typeof this.editingAssignmentIndex === 'number') {
      // update existing
      this.courseDetailsService.assignments[this.editingAssignmentIndex] = payload;
    } else {
      // add new
      this.courseDetailsService.assignments.push(payload);
    }

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

  // Helpers used by the template to safely render quiz items which
  // may come as strings (legacy format) or objects (new API shape).
  getQuestionText(q: any): string {
    if (!q && q !== 0) return '';
    if (typeof q === 'string') {
      return q.split(' | ')[0] || q;
    }
    if (q.question) return q.question;
    if (q.text) return q.text;
    // fallback stringify small objects
    try { return JSON.stringify(q); } catch { return String(q); }
  }

  getCorrectAnswer(q: any): string {
    if (!q && q !== 0) return '';
    if (typeof q === 'string') {
      const parts = q.split(' | Correct: ');
      return parts.length > 1 ? parts[1] : '';
    }
    if (q.correct) return q.correct;
    if (q.correctOption) return q.correctOption;
    if (q.answer) return q.answer;
    return '';
  }

  expandModuleIndex: number | null = null;
  toggleModule(index: number) {
    this.expandModuleIndex = this.expandModuleIndex === index ? null : index;
  }

  deleteQuiz(quizId: any) {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (!courseId || !quizId) {
      alert('No quiz id available to delete.');
      return;
    }

    if (!confirm('Delete this quiz? This action cannot be undone.')) return;

    this.quizService.deleteQuiz(courseId, quizId).subscribe(
      () => {
        // Remove quiz from list
        this.quizzesList.update(quizzes => quizzes.filter(q => q.id !== quizId));
        alert('Quiz deleted');
      },
      (err) => {
        console.error('Failed to delete quiz', err);
        alert('Failed to delete quiz');
      }
    );
  }
}
