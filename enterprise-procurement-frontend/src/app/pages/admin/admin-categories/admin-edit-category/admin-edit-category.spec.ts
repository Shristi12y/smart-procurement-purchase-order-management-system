import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditCategory } from './admin-edit-category';

describe('AdminEditCategory', () => {
  let component: AdminEditCategory;
  let fixture: ComponentFixture<AdminEditCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
