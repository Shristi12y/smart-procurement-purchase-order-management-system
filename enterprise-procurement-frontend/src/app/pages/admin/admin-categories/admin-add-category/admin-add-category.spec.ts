import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddCategory } from './admin-add-category';

describe('AdminAddCategory', () => {
  let component: AdminAddCategory;
  let fixture: ComponentFixture<AdminAddCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
