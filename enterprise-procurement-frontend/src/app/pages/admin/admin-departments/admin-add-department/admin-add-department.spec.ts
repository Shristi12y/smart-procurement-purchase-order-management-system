import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddDepartment } from './admin-add-department';

describe('AdminAddDepartment', () => {
  let component: AdminAddDepartment;
  let fixture: ComponentFixture<AdminAddDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddDepartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
