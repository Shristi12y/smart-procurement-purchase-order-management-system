import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAddProduct } from './supplier-add-product';

describe('SupplierAddProduct', () => {
  let component: SupplierAddProduct;
  let fixture: ComponentFixture<SupplierAddProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierAddProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierAddProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
