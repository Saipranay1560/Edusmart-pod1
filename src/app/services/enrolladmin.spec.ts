import { TestBed } from '@angular/core/testing';

import { Enrolladmin } from './enrolladmin';

describe('Enrolladmin', () => {
  let service: Enrolladmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Enrolladmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
