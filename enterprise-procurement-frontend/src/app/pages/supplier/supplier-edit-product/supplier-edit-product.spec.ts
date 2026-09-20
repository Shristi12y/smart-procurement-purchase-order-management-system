import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEditProduct } from './supplier-edit-product';

describe('SupplierEditProduct', () => {
  let component: SupplierEditProduct;
  let fixture: ComponentFixture<SupplierEditProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierEditProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierEditProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
