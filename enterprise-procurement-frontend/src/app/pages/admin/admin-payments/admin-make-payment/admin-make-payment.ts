import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { catchError, forkJoin, map, of } from 'rxjs';

interface PurchaseOrder {
  purchaseOrderId: number;
  quantity: number;
  totalAmount: number;
  status?: string;
  product?: {
    productId?: number;
    name?: string;
  };
  supplier?: {
    supplierId?: number;
    name?: string;
    email?: string;
  };
  createdBy?: {
    userId?: number;
    name?: string;
    email?: string;
  };
}

interface PaymentResponse {
  paymentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  remarks?: string;
  purchaseOrder?: PurchaseOrder;
}

@Component({
  selector: 'app-admin-make-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-make-payment.html',
  styleUrl: './admin-make-payment.scss'
})
export class AdminMakePayment implements OnInit {

  private purchaseOrderApi = 'http://localhost:8080/purchaseOrders';
    private apiUrl = 'http://localhost:8080/payments';


  private paymentApi ='http://localhost:8080/payments';

  purchaseOrders: PurchaseOrder[] = [];

  selectedPurchaseOrderId: number | null = null;

  selectedPurchaseOrder: PurchaseOrder | null = null;

  paymentMethod = '';

  remarks = '';

  loadingOrders = false;

  processingPayment = false;

  showConfirmation = false;

  paymentCompleted = false;

  paymentResponse: PaymentResponse | null = null;

  paymentMethods = [
    {
      value: 'UPI',
      label: 'UPI',
      description: 'Pay using UPI',
      icon: 'account_balance_wallet'
    },
    {
      value: 'CREDIT_CARD',
      label: 'Credit Card',
      description: 'Pay using a credit card',
      icon: 'credit_card'
    },
    {
      value: 'DEBIT_CARD',
      label: 'Debit Card',
      description: 'Pay using a debit card',
      icon: 'credit_card'
    },
    {
      value: 'NET_BANKING',
      label: 'Net Banking',
      description: 'Pay directly from your bank',
      icon: 'account_balance'
    },
    {
      value: 'BANK_TRANSFER',
      label: 'Bank Transfer',
      description: 'Transfer funds from company account',
      icon: 'swap_horiz'
    },
    {
      value: 'CASH',
      label: 'Cash',
      description: 'Record a cash payment',
      icon: 'payments'
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  // LOAD PURCHASE ORDERS


loadPurchaseOrders(): void {

  this.loadingOrders = true;

  this.http
    .get<PurchaseOrder[]>(this.purchaseOrderApi)
    .subscribe({

      next: (orders) => {

        const acceptedOrders =
          (orders || []).filter(
            order =>
              order.status === 'ACCEPTED'
          );


        if (acceptedOrders.length === 0) {

          this.purchaseOrders = [];

          this.loadingOrders = false;

          return;
        }


        // Check payment for every accepted PO
        const paymentChecks =
          acceptedOrders.map(order =>

            this.http
              .get<PaymentResponse>(
                `${this.paymentApi}/purchaseOrder/${order.purchaseOrderId}`
              )

              .pipe(

                // Payment exists
                map(() => ({
                  order,
                  hasPayment: true
                })),

                // Payment does not exist
                catchError(() => {

                  return of({
                    order,
                    hasPayment: false
                  });

                })

              )
          );


        forkJoin(paymentChecks)
          .subscribe({

            next: (results) => {

              this.purchaseOrders =
                results

                  .filter(
                    result =>
                      !result.hasPayment
                  )

                  .map(
                    result =>
                      result.order
                  );


              this.loadingOrders = false;
            },


            error: (error) => {

              console.error(
                'Failed to check payment status:',
                error
              );

              this.loadingOrders = false;

              this.showMessage(
                'Failed to check payment status.'
              );

            }

          });

      },


      error: (error) => {

        console.error(
          'Failed to load purchase orders:',
          error
        );

        this.loadingOrders = false;

        this.showMessage(
          error?.error?.message ||
          'Failed to load purchase orders.'
        );

      }

    });
}



  // ================================
  // SELECT PURCHASE ORDER
  // ================================

  selectPurchaseOrder(): void {

    if (!this.selectedPurchaseOrderId) {

      this.selectedPurchaseOrder = null;

      return;

    }

    this.selectedPurchaseOrder =
      this.purchaseOrders.find(
        order =>
          Number(order.purchaseOrderId) ===
          Number(this.selectedPurchaseOrderId)
      ) || null;
  }

  // SELECT PAYMENT METHOD

  selectPaymentMethod(method: string): void {

    this.paymentMethod = method;

  }

  // CONTINUE

  proceedToPayment(): void {

    if (!this.selectedPurchaseOrder) {

      this.showMessage(
        'Please select a purchase order.'
      );

      return;
    }

    if (!this.paymentMethod) {

      this.showMessage(
        'Please select a payment method.'
      );

      return;
    }

    this.showConfirmation = true;

  }

  // ================================
  // BACK TO PAYMENT FORM
  // ================================

  editPaymentDetails(): void {

    this.showConfirmation = false;

  }

  // ================================
  // CONFIRM PAYMENT
  // ================================

  confirmPayment(): void {

    if (!this.selectedPurchaseOrder) {
      return;
    }

    this.processingPayment = true;

    const payment = {

      purchaseOrder: {

        purchaseOrderId:
          this.selectedPurchaseOrder.purchaseOrderId

      },

      paymentMethod:
        this.paymentMethod,

      remarks:
        this.remarks.trim()

    };

    console.log(
      'Creating payment:',
      payment
    );

    this.http
      .post<PaymentResponse>(
        this.paymentApi,
        payment
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Payment created:',
            response
          );

          this.processingPayment = false;

          this.paymentResponse = response;

          this.showConfirmation = false;

          this.paymentCompleted = true;

          this.showMessage(
            'Payment initiated successfully.'
          );

        },

        error: (error) => {

          console.error(
            'Failed to create payment:',
            error
          );

          this.processingPayment = false;

          const message =
            error?.error?.message ||
            'Failed to process payment.';

          this.showMessage(message);

        }

      });

  }

  // ================================
  // RESET
  // ================================

  makeAnotherPayment(): void {

    this.selectedPurchaseOrderId = null;

    this.selectedPurchaseOrder = null;

    this.paymentMethod = '';

    this.remarks = '';

    this.paymentResponse = null;

    this.paymentCompleted = false;

    this.showConfirmation = false;

  }

  // ================================
  // NAVIGATION
  // ================================

  cancel(): void {

    this.router.navigate([
      '/admin/payments'
    ]);

  }

  goToPayments(): void {

    this.router.navigate([
      '/admin/payments'
    ]);

  }

  // ================================
  // PAYMENT METHOD LABEL
  // ================================

  getPaymentMethodLabel(
    method: string
  ): string {

    const found =
      this.paymentMethods.find(
        item =>
          item.value === method
      );

    return found?.label || method;

  }

  // MESSAGE

  private showMessage(
    message: string
  ): void {

    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3500,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );

  }


}