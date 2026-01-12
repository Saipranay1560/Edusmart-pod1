import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsComponent } from './enrollments';

describe('Enrollments', () => {
  let component: EnrollmentsComponent;
  let fixture: ComponentFixture<EnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
