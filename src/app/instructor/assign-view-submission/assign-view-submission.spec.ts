import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignViewSubmission } from './assign-view-submission';

describe('AssignViewSubmission', () => {
  let component: AssignViewSubmission;
  let fixture: ComponentFixture<AssignViewSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignViewSubmission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignViewSubmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
