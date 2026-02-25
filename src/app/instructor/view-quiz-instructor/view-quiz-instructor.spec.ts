import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuizInstructor } from './view-quiz-instructor';

describe('ViewQuizInstructor', () => {
  let component: ViewQuizInstructor;
  let fixture: ComponentFixture<ViewQuizInstructor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewQuizInstructor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewQuizInstructor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
