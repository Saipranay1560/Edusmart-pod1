import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz-service';
import { ContentService } from '../../services/content-service';
import { AssignmentService } from '../../services/assignment.service';
import { CourseService } from '../../services/course-service';
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
  questions: string[] = [];
  activeTab = 'content';

  // Course data loaded from API
  course: any = {
    id: 0,
    name: '',
    description: '',
    status: 'APPROVED',
    instructor: null,
    contents: []
  };

  // Quiz reactive state using signals - support multiple quizzes
  quizzesList = signal<Array<{
    id?: any;
    title: string;
    description: string;
    questions: string[];
  }>>([]);

  hasQuizzes = computed(() => this.quizzesList().length > 0);

  // Content (YouTube) properties
  contentVideos: Array<{ url: string; title: string; description?: string; id?: string; contentId?: number }> = [];
  newVideoTitle: string = '';
  newVideoUrl: string = '';
  showContentModal: boolean = false;
  contentSuccessMessage: string | null = null;
  contentErrorMessage: string | null = null;
  isSavingContent: boolean = false;

  // Assignment properties
  assignments: Array<{ id?: number; title: string; assignmentQuestions: string[]; endDate: string }> = [];

  // New Date Properties
  assignmentDueDate: string = '';
  quizDueDate: string = '';

  // Feedback Messages
  assignmentSuccessMessage: string | null = null;

  // Assignment modal state
  showAssignmentModal: boolean = false;
  editingAssignmentIndex: number | null = null;
  assignForm: { title: string; endDate: string; assignmentQuestions: string[] } = {
    title: '',
    endDate: '',
    assignmentQuestions: []
  };
  newQuestion: string = '';

  option1 = '';
  option2 = '';
  option3 = '';
  option4 = '';
  correctOption = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private quizService: QuizService,
    private contentService: ContentService,
    private assignmentService: AssignmentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        // Load course data from API
        this.loadCourse(Number(courseId));
        // load quiz data for this course from backend
        this.loadQuizzes(Number(courseId));
        // load content data for this course from API
        this.loadContent(Number(courseId));
        // load assignments for this course from API
        this.loadAssignments(Number(courseId));
      }
    });

    // Also refresh all data when route activates (e.g., after returning from quiz-create)
    this.route.queryParams.subscribe(() => {
      const courseId = Number(this.route.snapshot.paramMap.get('id'));
      if (courseId) {
        this.loadCourse(courseId);
        this.loadQuizzes(courseId);
        this.loadContent(courseId);
        this.loadAssignments(courseId);
      }
    });
  }

  private loadCourse(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe(
      (res: any) => {
        this.course = {
          id: res.id || 0,
          name: res.name || res.title || '',
          description: res.description || '',
          status: res.status || 'APPROVED',
          instructor: res.instructor || null,
          contents: res.contents || [],
          published: res.status === 'APPROVED'
        };
        console.log('Course loaded from API:', this.course);
      },
      (err) => {
        console.error('Failed to load course:', err);
        this.course = {
          id: courseId,
          name: 'Course Not Found',
          description: 'Unable to load course details',
          status: 'UNKNOWN',
          instructor: null,
          contents: [],
          published: false
        };
      }
    );
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

  private loadContent(courseId: number) {
    this.contentService.getContentByCourseId(courseId).subscribe(
      (res: any) => {
        let content: any[] = [];

        // Normalize response to array of content
        if (!res) {
          this.contentVideos = [];
          return;
        }

        if (Array.isArray(res)) {
          content = res;
        } else if (typeof res === 'object') {
          content = [res];
        }

        // Map each content item to expected format
        const normalizedContent = content.map((item: any) => {
          const extractedId = this.extractYoutubeId(item.url || item.videoUrl || '');
          return {
            url: item.url || item.videoUrl || '',
            title: item.title || item.videoTitle || 'Video',
            description: item.description || '',
            id: extractedId || undefined
          };
        }).filter(item => item.id); // Only keep items with valid YouTube IDs

        this.contentVideos = normalizedContent;
        console.log('Content loaded from API:', this.contentVideos);
      },
      (err) => {
        console.error('Failed to load content for course', courseId, err);
        this.contentVideos = [];
      }
    );
  }

  private loadAssignments(courseId: number) {
    this.assignmentService.getAssignmentsByCourseId(courseId).subscribe(
      (res: any) => {
        let assignmentsData: any[] = [];

        // Normalize response to array of assignments
        if (!res) {
          this.assignments = [];
          return;
        }

        if (Array.isArray(res)) {
          assignmentsData = res;
        } else if (typeof res === 'object') {
          assignmentsData = [res];
        }

        // Map each assignment to expected format
        this.assignments = assignmentsData.map((item: any) => ({
          id: item.id || item.assignmentId,
          title: item.title || 'Assignment',
          assignmentQuestions: Array.isArray(item.assignmentQuestions) ? item.assignmentQuestions : [],
          endDate: item.endDate || item.end_date || ''
        }));

        console.log('Assignments loaded from API:', this.assignments);
      },
      (err) => {
        console.error('Failed to load assignments for course', courseId, err);
        this.assignments = [];
      }
    );
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


    this.assignmentSuccessMessage = "Assignment has been added successfully!";
    this.questions = [];
    this.assignmentDueDate = ''; // Reset date

    setTimeout(() => {
      this.assignmentSuccessMessage = null;
    }, 3000);
  }

  deleteAssignment(index: number) {
    const assignment = this.assignments[index];
    if (!assignment || !assignment.id) {
      console.log('Cannot delete assignment without ID');
      return;
    }

    if (confirm('Delete this assignment?')) {
      this.assignmentService.deleteAssignment(this.course.id,assignment.id).subscribe(
        () => {
          console.log('Assignment deleted from API');
          this.assignments.splice(index, 1);
          this.assignmentSuccessMessage = 'Assignment deleted successfully!';
          setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
        },
        (err) => {
          console.error('Failed to delete assignment:', err);
          // Still delete locally as fallback
          this.assignments.splice(index, 1);
          this.assignmentSuccessMessage = 'Assignment deleted locally (API delete failed)';
          setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
        }
      );
    }
  }

  // Assignment modal handlers
  openAssignmentModal(index?: number) {
    if (typeof index === 'number') {
      const a = this.assignments[index];
      if (a) {
        this.editingAssignmentIndex = index;
        this.assignForm = {
          title: a.title || '',
          endDate: a.endDate || '',
          assignmentQuestions: [...(a.assignmentQuestions || [])]
        };
      }
    } else {
      this.editingAssignmentIndex = null;
      this.assignForm = { title: '', endDate: '', assignmentQuestions: [] };
      this.newQuestion = '';
    }
    this.showAssignmentModal = true;
  }

  addQuestionToAssignment() {
    if (this.newQuestion.trim() !== '') {
      this.assignForm.assignmentQuestions.push(this.newQuestion.trim());
      this.newQuestion = '';
    }
  }

  removeQuestionFromAssignment(index: number) {
    this.assignForm.assignmentQuestions.splice(index, 1);
  }

  closeAssignmentModal() {
    this.showAssignmentModal = false;
    this.editingAssignmentIndex = null;
    this.newQuestion = '';
  }

  saveAssignment() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));

    // Extract instructorId from localStorage user object
    let instructorId = 0;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        instructorId = user.id || 0;
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
    }

    // Validate form
    if (!this.assignForm.title.trim()) {
      alert('Please enter assignment title');
      return;
    }
    if (!this.assignForm.endDate) {
      alert('Please select end date');
      return;
    }
    if (this.assignForm.assignmentQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }    const payload = {
      courseId: courseId,
      instructorId: instructorId,
      title: this.assignForm.title.trim(),
      endDate: this.assignForm.endDate,
      assignmentQuestions: this.assignForm.assignmentQuestions
    };

    if (this.editingAssignmentIndex !== null && typeof this.editingAssignmentIndex === 'number') {
      // Update existing assignment
      const assignmentId = this.assignments[this.editingAssignmentIndex]?.id;
      if (assignmentId) {
        this.assignmentService.updateAssignment(assignmentId, payload).subscribe(
          (response: any) => {
            console.log('Assignment updated on API:', response);
            this.assignments[this.editingAssignmentIndex!] = {
              id: assignmentId,
              title: payload.title,
              endDate: payload.endDate,
              assignmentQuestions: payload.assignmentQuestions
            };
            this.assignmentSuccessMessage = 'Assignment updated successfully!';
            setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
            this.closeAssignmentModal();
          },
          (err) => {
            console.error('Failed to update assignment:', err);
            // Still update locally as fallback
            this.assignments[this.editingAssignmentIndex!] = {
              id: assignmentId,
              title: payload.title,
              endDate: payload.endDate,
              assignmentQuestions: payload.assignmentQuestions
            };
            this.assignmentSuccessMessage = 'Assignment updated locally (API update failed)';
            setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
            this.closeAssignmentModal();
          }
        );
      } else {
        this.closeAssignmentModal();
      }
    } else {
      // Add new assignment
      this.assignmentService.addAssignment(payload).subscribe(
        (response: any) => {
          console.log('Assignment saved to API:', response);
          this.assignments.push({
            id: response.id || response.assignmentId,
            title: payload.title,
            endDate: payload.endDate,
            assignmentQuestions: payload.assignmentQuestions
          });
          this.assignmentSuccessMessage = 'Assignment added successfully!';
          setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
          this.closeAssignmentModal();
        },
        (err) => {
          console.error('Failed to save assignment:', err);
          // Still add locally as fallback
          this.assignments.push({
            title: payload.title,
            endDate: payload.endDate,
            assignmentQuestions: payload.assignmentQuestions
          });
          this.assignmentSuccessMessage = 'Assignment added locally (API save failed)';
          setTimeout(() => { this.assignmentSuccessMessage = null; }, 3000);
          this.closeAssignmentModal();
        }
      );
    }
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

deleteQuizQuestion(index: number) {
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
    // Clear previous messages
    this.contentSuccessMessage = null;
    this.contentErrorMessage = null;

    const url = (this.newVideoUrl || '').trim();
    if (!url) {
      this.contentErrorMessage = 'Please enter a video URL.';
      setTimeout(() => { this.contentErrorMessage = null; }, 3000);
      return;
    }

    const id = this.extractYoutubeId(url);
    if (!id) {
      this.contentErrorMessage = 'Please enter a valid YouTube URL (youtu.be or youtube.com).';
      setTimeout(() => { this.contentErrorMessage = null; }, 3000);
      return;
    }

    const providedTitle = (this.newVideoTitle || '').trim();
    const title = providedTitle || `Video ${this.contentVideos.length + 1}`;
    const courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!courseId) {
      this.contentErrorMessage = 'Course ID not found.';
      setTimeout(() => { this.contentErrorMessage = null; }, 3000);
      return;
    }

    // Prepare content object to send to API
    // API expects: { title, courseId, url }
    const contentData = {
      title: title,
      courseId: courseId,
      url: url
    };
    console.log('Adding content with data:', contentData);

    this.isSavingContent = true;

    // Save to API
    this.contentService.addContent(contentData).subscribe(
      (response: any) => {
        this.isSavingContent = false;
        console.log('Content saved to API:', response);

        const item = {
          url,
          title,
          description: '',
          id,
          contentId: response.id || response.contentId // Store content ID from response
        };

        this.contentVideos.push(item);

        // Clear modal inputs
        this.newVideoUrl = '';
        this.newVideoTitle = '';
        this.closeContentModal();

        this.contentSuccessMessage = 'Video added successfully!';
        setTimeout(() => { this.contentSuccessMessage = null; }, 3000);
      },
      (err) => {
        this.isSavingContent = false;
        console.error('Failed to save content:', err);

        // Determine error message
        let errorMsg = 'Failed to add video';
        if (err.error?.message) {
          errorMsg += ': ' + err.error.message;
        } else if (err.message) {
          errorMsg += ': ' + err.message;
        }

        this.contentErrorMessage = errorMsg;
        setTimeout(() => { this.contentErrorMessage = null; }, 4000);
      }
    );
  }

  openContentModal() {
    this.showContentModal = true;
  }

  closeContentModal() {
    this.showContentModal = false;
  }

  removeContentVideo(index: number) {
    const videoItem = this.contentVideos[index];
    if (!videoItem) return;

    if (confirm(`Delete video "${videoItem.title}"?`)) {
      // Delete from API if we have a content ID
      if (videoItem.contentId) {
        this.contentService.deleteContent(videoItem.contentId).subscribe(
          () => {
            console.log('Video deleted from API');
            this.contentVideos.splice(index, 1);
            this.contentSuccessMessage = 'Video deleted successfully!';
            setTimeout(() => { this.contentSuccessMessage = null; }, 3000);
          },
          (err) => {
            console.error('Failed to delete video from API:', err);
            // Still delete locally as fallback
            this.contentVideos.splice(index, 1);
            this.contentSuccessMessage = 'Video deleted locally (API delete failed)';
            setTimeout(() => { this.contentSuccessMessage = null; }, 3000);
          }
        );
      } else {
        // Delete locally if no content ID
        this.contentVideos.splice(index, 1);
        this.contentSuccessMessage = 'Video removed';
        setTimeout(() => { this.contentSuccessMessage = null; }, 3000);
      }
    }
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

  navigateToViewQuiz() {
    this.router.navigate(['/instructor/quiz-view']);
  }
}
