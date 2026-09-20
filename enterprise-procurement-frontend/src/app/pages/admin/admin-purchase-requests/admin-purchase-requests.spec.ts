import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPurchaseRequests } from './admin-purchase-requests';

describe('AdminPurchaseRequests', () => {
  let component: AdminPurchaseRequests;
  let fixture: ComponentFixture<AdminPurchaseRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPurchaseRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPurchaseRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
