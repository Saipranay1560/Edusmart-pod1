import { TestBed } from '@angular/core/testing';

import { CourseDetails } from './course-details';

describe('CourseDetails', () => {
  let service: CourseDetails;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseDetails);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
