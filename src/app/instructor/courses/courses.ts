import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course';
import { Course } from '../../models/courses'; 

 
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css']
})
export class Courses {
  courses: Course[]=[];
  newCourse: Course = {
    id:0,
    title: '',
    description: '',
    status: 'Draft'
  }
  constructor(private courseService: CourseService){}
  ngOnInit(){
    this.courses=this.courseService.getCourses();
  }
  addCourse(){
    if(!this.newCourse.title || !this.newCourse.description)
      return;
    this.courseService.addCourse(this.newCourse);
    this.newCourse={
      id:0,
      title:'',
      description:'',
      status:'Draft'
    };
    this.courses=this.courseService.getCourses();
  }
  publishCourse(course: Course){
    this.courseService.publishCourse(course);
  }
  archiveCourse(course:Course){
    this.courseService.archiveCourse(course);
  }
 
}
