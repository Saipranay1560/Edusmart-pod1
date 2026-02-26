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
  questions = signal<string[]>([]);
  activeTab = signal('content');

  // Course data loaded from API
  course = signal<any>({
    id: 0,
    name: '',
    description: '',
    status: 'APPROVED',
    instructor: null,
    contents: [],
    published: false
  });

  // Quiz reactive state using signals - support multiple quizzes
  quizzesList = signal<Array<{
    id?: any;
    title: string;
    description: string;
    questions: string[];
  }>>([]);

  hasQuizzes = computed(() => this.quizzesList().length > 0);

  // Content (YouTube) properties
  contentVideos = signal<Array<{ url: string; title: string; description?: string; id?: string; contentId?: number }>>([]);
  newVideoTitle = signal('');
  newVideoUrl = signal('');
  showContentModal = signal(false);
  contentSuccessMessage = signal<string | null>(null);
  contentErrorMessage = signal<string | null>(null);
  isSavingContent = signal(false);

  // Assignment properties
  assignments = signal<Array<{ id?: number; title: string; assignmentQuestions: string[]; endDate: string }>>([]);

  // New Date Properties
  assignmentDueDate = signal('');
  quizDueDate = signal('');

  // Feedback Messages
  assignmentSuccessMessage = signal<string | null>(null);

  // Assignment modal state
  showAssignmentModal = signal(false);
  editingAssignmentIndex = signal<number | null>(null);
  assignForm = signal({ title: '', endDate: '', assignmentQuestions: <string[]>[] });
  newQuestion = signal('');

  option1 = signal('');
  option2 = signal('');
  option3 = signal('');
  option4 = signal('');
  correctOption = signal('');

  expandModuleIndex = signal<number | null>(null);
  isQuizAdded = signal(false);

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
        this.course.set({
          id: res.id || 0,
          name: res.name || res.title || '',
          description: res.description || '',
          status: res.status || 'APPROVED',
          instructor: res.instructor || null,
          contents: res.contents || [],
          published: res.status === 'APPROVED'
        });
        console.log('Course loaded from API:', this.course());
      },
      (err) => {
        console.error('Failed to load course:', err);
        this.course.set({
          id: courseId,
          name: 'Course Not Found',
          description: 'Unable to load course details',
          status: 'UNKNOWN',
          instructor: null,
          contents: [],
          published: false
        });
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
          this.contentVideos.set([]);
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

        this.contentVideos.set(normalizedContent);
        console.log('Content loaded from API:', this.contentVideos());
      },
      (err) => {
        console.error('Failed to load content for course', courseId, err);
        this.contentVideos.set([]);
      }
    );
  }

  private loadAssignments(courseId: number) {
    this.assignmentService.getAssignmentsByCourseId(courseId).subscribe(
      (res: any) => {
        let assignmentsData: any[] = [];

        // Normalize response to array of assignments
        if (!res) {
          this.assignments.set([]);
          return;
        }

        if (Array.isArray(res)) {
          assignmentsData = res;
        } else if (typeof res === 'object') {
          assignmentsData = [res];
        }

        // Map each assignment to expected format
        const mappedAssignments = assignmentsData.map((item: any) => ({
          id: item.id || item.assignmentId,
          title: item.title || 'Assignment',
          assignmentQuestions: Array.isArray(item.assignmentQuestions) ? item.assignmentQuestions : [],
          endDate: item.endDate || item.end_date || ''
        }));

        this.assignments.set(mappedAssignments);
        console.log('Assignments loaded from API:', this.assignments());
      },
      (err) => {
        console.error('Failed to load assignments for course', courseId, err);
        this.assignments.set([]);
      }
    );
  }
  togglePublish() {
    this.course.update(c => ({ ...c, published: !c.published }));
  }

  // --- Assignment Logic ---
  addQuestion() {
    const q = this.newQuestion().trim();
    if (q !== '') {
      this.questions.update(qs => [...qs, q]);
      this.newQuestion.set('');
    }
  }

  deleteAssignmentQuestion(index: number) {
    this.questions.update(qs => qs.filter((_, i) => i !== index));
  }

  addAssignmentToCourse() {
    this.assignmentSuccessMessage.set("Assignment has been added successfully!");
    this.questions.set([]);
    this.assignmentDueDate.set('');

    setTimeout(() => {
      this.assignmentSuccessMessage.set(null);
    }, 3000);
  }

  deleteAssignment(index: number) {
    const currentAssignments = this.assignments();
    const assignment = currentAssignments[index];
    if (!assignment || !assignment.id) {
      console.log('Cannot delete assignment without ID');
      return;
    }

    if (confirm('Delete this assignment?')) {
      this.assignmentService.deleteAssignment(this.course().id, assignment.id).subscribe(
        () => {
          console.log('Assignment deleted from API');
          this.assignments.update(a => a.filter((_, i) => i !== index));
          this.assignmentSuccessMessage.set('Assignment deleted successfully!');
          setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
        },
        (err) => {
          console.error('Failed to delete assignment:', err);
          this.assignments.update(a => a.filter((_, i) => i !== index));
          this.assignmentSuccessMessage.set('Assignment deleted locally (API delete failed)');
          setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
        }
      );
    }
  }

  // Assignment modal handlers
  openAssignmentModal(index?: number) {
    if (typeof index === 'number') {
      const currentAssignments = this.assignments();
      const a = currentAssignments[index];
      if (a) {
        this.editingAssignmentIndex.set(index);
        this.assignForm.set({
          title: a.title || '',
          endDate: a.endDate || '',
          assignmentQuestions: [...(a.assignmentQuestions || [])]
        });
      }
    } else {
      this.editingAssignmentIndex.set(null);
      this.assignForm.set({ title: '', endDate: '', assignmentQuestions: [] });
      this.newQuestion.set('');
    }
    this.showAssignmentModal.set(true);
  }

  addQuestionToAssignment() {
    const q = this.newQuestion().trim();
    if (q !== '') {
      this.assignForm.update(f => ({
        ...f,
        assignmentQuestions: [...f.assignmentQuestions, q]
      }));
      this.newQuestion.set('');
    }
  }

  removeQuestionFromAssignment(index: number) {
    this.assignForm.update(f => ({
      ...f,
      assignmentQuestions: f.assignmentQuestions.filter((_, i) => i !== index)
    }));
  }

  closeAssignmentModal() {
    this.showAssignmentModal.set(false);
    this.editingAssignmentIndex.set(null);
    this.newQuestion.set('');
  }

  updateAssignmentFormTitle(value: string) {
    this.assignForm.update(f => ({ ...f, title: value }));
  }

  updateAssignmentFormEndDate(value: string) {
    this.assignForm.update(f => ({ ...f, endDate: value }));
  }

  viewSubmissions(assignmentId: any) {
    if (assignmentId) {
      this.router.navigate(['/assign-view-submission', assignmentId]);
    } else {
      console.error("Assignment ID is missing!");
    }
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
    const form = this.assignForm();
    if (!form.title.trim()) {
      alert('Please enter assignment title');
      return;
    }
    if (!form.endDate) {
      alert('Please select end date');
      return;
    }
    if (form.assignmentQuestions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const payload = {
      courseId: courseId,
      instructorId: instructorId,
      title: form.title.trim(),
      endDate: form.endDate,
      assignmentQuestions: form.assignmentQuestions
    };

    if (this.editingAssignmentIndex() !== null) {
      // Update existing assignment
      const currentAssignments = this.assignments();
      const assignmentId = currentAssignments[this.editingAssignmentIndex()!]?.id;
      if (assignmentId) {
        this.assignmentService.updateAssignment(assignmentId, payload).subscribe(
          (response: any) => {
            console.log('Assignment updated on API:', response);
            this.assignments.update(a => {
              const updated = [...a];
              updated[this.editingAssignmentIndex()!] = {
                id: assignmentId,
                title: payload.title,
                endDate: payload.endDate,
                assignmentQuestions: payload.assignmentQuestions
              };
              return updated;
            });
            this.assignmentSuccessMessage.set('Assignment updated successfully!');
            setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
            this.closeAssignmentModal();
          },
          (err) => {
            console.error('Failed to update assignment:', err);
            this.assignments.update(a => {
              const updated = [...a];
              updated[this.editingAssignmentIndex()!] = {
                id: assignmentId,
                title: payload.title,
                endDate: payload.endDate,
                assignmentQuestions: payload.assignmentQuestions
              };
              return updated;
            });
            this.assignmentSuccessMessage.set('Assignment updated locally (API update failed)');
            setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
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
          this.assignments.update(a => [...a, {
            id: response.id || response.assignmentId,
            title: payload.title,
            endDate: payload.endDate,
            assignmentQuestions: payload.assignmentQuestions
          }]);
          this.assignmentSuccessMessage.set('Assignment added successfully!');
          setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
          this.closeAssignmentModal();
        },
        (err) => {
          console.error('Failed to save assignment:', err);
          this.assignments.update(a => [...a, {
            title: payload.title,
            endDate: payload.endDate,
            assignmentQuestions: payload.assignmentQuestions
          }]);
          this.assignmentSuccessMessage.set('Assignment added locally (API save failed)');
          setTimeout(() => { this.assignmentSuccessMessage.set(null); }, 3000);
          this.closeAssignmentModal();
        }
      );
    }
  }

  // --- Quiz Logic ---
  addQuizQuestion() {
    const newQ = this.newQuestion();
    if (newQ) {
      const fullQuestion =
        newQ + ' | Options: ' +
        this.option1() + ', ' +
        this.option2() + ', ' +
        this.option3() + ', ' +
        this.option4() + ' | Correct: ' + this.correctOption();

      this.newQuestion.set('');
      this.option1.set('');
      this.option2.set('');
      this.option3.set('');
      this.option4.set('');
      this.correctOption.set('');
    }
  }

  deleteQuizQuestion(index: number) {
  }

  addQuizToPortal() {
    this.isQuizAdded.set(true);
    const dueDate = this.quizDueDate();
    const message = dueDate
      ? `Quiz has been successfully added! Last date to submit: ${dueDate}`
      : 'Quiz has been successfully added to the Course!';
    alert(message);
  }

  // New method to handle "Add New Quiz" button
  resetQuizForm() {
    this.isQuizAdded.set(false);
    this.quizDueDate.set('');
  }

  deleteWholeQuiz() {
    if (confirm("Are you sure you want to delete the entire quiz?")) {
      this.resetQuizForm();
    }
  }


  // --- Content (YouTube) Logic ---
  addContentVideo() {
    // Clear previous messages
    this.contentSuccessMessage.set(null);
    this.contentErrorMessage.set(null);

    const url = (this.newVideoUrl() || '').trim();
    if (!url) {
      this.contentErrorMessage.set('Please enter a video URL.');
      setTimeout(() => { this.contentErrorMessage.set(null); }, 3000);
      return;
    }

    const id = this.extractYoutubeId(url);
    if (!id) {
      this.contentErrorMessage.set('Please enter a valid YouTube URL (youtu.be or youtube.com).');
      setTimeout(() => { this.contentErrorMessage.set(null); }, 3000);
      return;
    }

    const providedTitle = (this.newVideoTitle() || '').trim();
    const title = providedTitle || `Video ${this.contentVideos().length + 1}`;
    const courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!courseId) {
      this.contentErrorMessage.set('Course ID not found.');
      setTimeout(() => { this.contentErrorMessage.set(null); }, 3000);
      return;
    }

    // Prepare content object to send to API
    const contentData = {
      title: title,
      courseId: courseId,
      url: url
    };
    console.log('Adding content with data:', contentData);

    this.isSavingContent.set(true);

    // Save to API
    this.contentService.addContent(contentData).subscribe(
      (response: any) => {
        this.isSavingContent.set(false);
        console.log('Content saved to API:', response);

        const item = {
          url,
          title,
          description: '',
          id,
          contentId: response.id || response.contentId
        };

        this.contentVideos.update(v => [...v, item]);

        // Clear modal inputs
        this.newVideoUrl.set('');
        this.newVideoTitle.set('');
        this.closeContentModal();

        this.contentSuccessMessage.set('Video added successfully!');
        setTimeout(() => { this.contentSuccessMessage.set(null); }, 3000);
      },
      (err) => {
        this.isSavingContent.set(false);
        console.error('Failed to save content:', err);

        let errorMsg = 'Failed to add video';
        if (err.error?.message) {
          errorMsg += ': ' + err.error.message;
        } else if (err.message) {
          errorMsg += ': ' + err.message;
        }

        this.contentErrorMessage.set(errorMsg);
        setTimeout(() => { this.contentErrorMessage.set(null); }, 4000);
      }
    );
  }

  openContentModal() {
    this.showContentModal.set(true);
  }

  closeContentModal() {
    this.showContentModal.set(false);
  }

  removeContentVideo(index: number) {
    const videos = this.contentVideos();
    const videoItem = videos[index];
    if (!videoItem) return;

    if (confirm(`Delete video "${videoItem.title}"?`)) {
      if (videoItem.contentId) {
        this.contentService.deleteContent(videoItem.contentId).subscribe(
          () => {
            console.log('Video deleted from API');
            this.contentVideos.update(v => v.filter((_, i) => i !== index));
            this.contentSuccessMessage.set('Video deleted successfully!');
            setTimeout(() => { this.contentSuccessMessage.set(null); }, 3000);
          },
          (err) => {
            console.error('Failed to delete video from API:', err);
            this.contentVideos.update(v => v.filter((_, i) => i !== index));
            this.contentSuccessMessage.set('Video deleted locally (API delete failed)');
            setTimeout(() => { this.contentSuccessMessage.set(null); }, 3000);
          }
        );
      } else {
        this.contentVideos.update(v => v.filter((_, i) => i !== index));
        this.contentSuccessMessage.set('Video removed');
        setTimeout(() => { this.contentSuccessMessage.set(null); }, 3000);
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

  toggleModule(index: number) {
    this.expandModuleIndex.update(current => current === index ? null : index);
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
