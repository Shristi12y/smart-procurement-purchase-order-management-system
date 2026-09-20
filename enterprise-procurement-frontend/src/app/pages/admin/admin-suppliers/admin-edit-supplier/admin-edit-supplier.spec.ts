import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditSupplier } from './admin-edit-supplier';

describe('AdminEditSupplier', () => {
  let component: AdminEditSupplier;
  let fixture: ComponentFixture<AdminEditSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
