import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentComponent } from './enrollments';

describe('Enrollments', () => {
  let component: EnrollmentComponent;
  let fixture: ComponentFixture<EnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
