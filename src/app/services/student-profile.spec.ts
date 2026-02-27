import { TestBed } from '@angular/core/testing';

import { StudentProfile } from './student-profile';

describe('StudentProfile', () => {
  let service: StudentProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
