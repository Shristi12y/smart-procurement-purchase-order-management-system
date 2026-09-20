import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditDepartment } from './admin-edit-department';

describe('AdminEditDepartment', () => {
  let component: AdminEditDepartment;
  let fixture: ComponentFixture<AdminEditDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditDepartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
