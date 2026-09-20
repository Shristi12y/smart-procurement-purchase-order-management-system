import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddSupplier } from './admin-add-supplier';

describe('AdminAddSupplier', () => {
  let component: AdminAddSupplier;
  let fixture: ComponentFixture<AdminAddSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
