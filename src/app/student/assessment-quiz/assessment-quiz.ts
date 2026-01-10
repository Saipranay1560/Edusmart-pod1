import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-assessment-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessment-quiz.html',
  styleUrls: ['./assessment-quiz.css']
})
export class AssessmentQuiz {
 
  quiz: any;
 
  quizzes = [
    {
      id: 1,
      title: 'Angular Basics Quiz',
      questions: [
        {
          question: 'What is Angular?',
          options: ['Framework', 'Library', 'Language', 'Database']
        },
        {
          question: 'Which language is used in Angular?',
          options: ['Python', 'Java', 'TypeScript', 'C++']
        },
        {
          question: 'What is a component?',
          options: [
            'HTML page',
            'Reusable UI block',
            'Service',
            'Database table'
          ]
        },
        {
          question: 'Which decorator defines a component?',
          options: ['@NgModule', '@Injectable', '@Component', '@Pipe']
        },
        {
          question: 'Angular is developed by?',
          options: ['Facebook', 'Google', 'Microsoft', 'Amazon']
        },
        {
          question: 'What is data binding?',
          options: [
            'Connecting DB',
            'Component-template communication',
            'Routing',
            'Styling'
          ]
        }
      ]
    },
 
    {
      id: 2,
      title: 'Java Fundamentals Quiz',
      questions: [
        {
          question: 'What is Java?',
          options: ['OS', 'Programming Language', 'Browser', 'Framework']
        },
        {
          question: 'Which company owns Java?',
          options: ['Oracle', 'Microsoft', 'Google', 'IBM']
        },
        {
          question: 'What is JVM?',
          options: [
            'Java Virtual Machine',
            'Java Variable Method',
            'Java Version Manager',
            'None'
          ]
        },
        {
          question: 'Which keyword is used to inherit?',
          options: ['this', 'super', 'extends', 'implements']
        },
        {
          question: 'Java supports?',
          options: [
            'Procedural',
            'Object Oriented',
            'Functional',
            'All of the above'
          ]
        },
        {
          question: 'Which is not OOP concept?',
          options: ['Inheritance', 'Encapsulation', 'Compilation', 'Polymorphism']
        }
      ]
    },
 
    {
      id: 3,
      title: 'Python Basics Quiz',
      questions: [
        {
          question: 'Python is?',
          options: ['Compiled', 'Interpreted', 'Machine code', 'Assembly']
        },
        {
          question: 'Who created Python?',
          options: [
            'James Gosling',
            'Guido van Rossum',
            'Dennis Ritchie',
            'Bjarne Stroustrup'
          ]
        },
        {
          question: 'Which symbol is used for comments?',
          options: ['//', '#', '/* */', '--']
        },
        {
          question: 'Python file extension?',
          options: ['.java', '.py', '.js', '.ts']
        },
        {
          question: 'Which data type is mutable?',
          options: ['Tuple', 'String', 'List', 'Integer']
        },
        {
          question: 'Which keyword defines a function?',
          options: ['func', 'define', 'def', 'function']
        }
      ]
    }
  ];
 
  constructor(private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quiz = this.quizzes.find(q => q.id === id);
  }
}