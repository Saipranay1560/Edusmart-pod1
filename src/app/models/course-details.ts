export interface Module {
  name: string;
  lessons: string[];
}
 
export interface Assignment {
  title: string;
  dueDate: string;
  status: string;
}
 
export interface Resource {
  name: string;
  type: 'PDF' | 'Video';
  file: File;
}
 
export interface Quiz {
  title: string;
  questions: string[];
  description?: string;
}
 
export interface CourseDetailsModel {
  id?: number;
  title: string;
  description: string;
  published: boolean;
  modules: Module[];
}
