import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPurchaseOrder } from './supplier-purchase-order';

describe('SupplierPurchaseOrder', () => {
  let component: SupplierPurchaseOrder;
  let fixture: ComponentFixture<SupplierPurchaseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPurchaseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPurchaseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
