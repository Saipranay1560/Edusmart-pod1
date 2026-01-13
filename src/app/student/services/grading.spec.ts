import { TestBed } from '@angular/core/testing';

import { Grading } from './grading';

describe('Grading', () => {
  let service: Grading;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Grading);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
