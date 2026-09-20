import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditProduct } from './admin-edit-product';

describe('AdminEditProduct', () => {
  let component: AdminEditProduct;
  let fixture: ComponentFixture<AdminEditProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
