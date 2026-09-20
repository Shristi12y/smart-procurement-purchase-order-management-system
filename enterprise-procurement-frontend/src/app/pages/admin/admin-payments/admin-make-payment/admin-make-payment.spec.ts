import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMakePayment } from './admin-make-payment';

describe('AdminMakePayment', () => {
  let component: AdminMakePayment;
  let fixture: ComponentFixture<AdminMakePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMakePayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMakePayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
