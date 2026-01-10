import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualClassroom } from './virtual-classroom';

describe('VirtualClassroom', () => {
  let component: VirtualClassroom;
  let fixture: ComponentFixture<VirtualClassroom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualClassroom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualClassroom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
