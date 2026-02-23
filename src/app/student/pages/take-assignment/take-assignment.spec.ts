import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAssignment } from './take-assignment';

describe('TakeAssignment', () => {
  let component: TakeAssignment;
  let fixture: ComponentFixture<TakeAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeAssignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
