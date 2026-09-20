import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProducts } from './supplier-products';

describe('SupplierProducts', () => {
  let component: SupplierProducts;
  let fixture: ComponentFixture<SupplierProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
