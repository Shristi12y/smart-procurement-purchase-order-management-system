import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

interface Payment {
  paymentId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  remarks?: string;

  purchaseOrder?: {
    purchaseOrderId: number;
    totalAmount?: number;
    product?: {
      name: string;
    };
    quantity?: number;
    supplier?: {
      name: string;
      email?: string;
    };
    createdBy?: {
      name: string;
      email?: string;
    };
  };
}

@Component({
  selector: 'app-admin-payments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    NgClass,

    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-payments.html',
  styleUrl: './admin-payments.scss'
})
export class AdminPayments implements OnInit {

  private apiUrl = 'http://localhost:8080/payments';

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];

  loading = false;

  searchText = '';
  selectedStatus = 'ALL';
  selectedMethod = 'ALL';

  showPaymentDetails = false;
  selectedPayment: Payment | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getPayments();
  }

  // GET ALL PAYMENTS

  getPayments(): void {

    this.loading = true;

    this.http
      .get<Payment[]>(this.apiUrl)
      .subscribe({

        next: (response) => {

          console.log('Payments received:', response);

          this.payments = response || [];

          this.filteredPayments = [...this.payments];

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to fetch payments:',
            error
          );

          this.loading = false;

          this.snackBar.open(
            error?.error?.message ||
            'Failed to load payments.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );
        }
      });
  }

  // FILTER PAYMENTS

  filterPayments(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    this.filteredPayments =
      this.payments.filter(payment => {

        const transactionId =
          payment.transactionId
            ?.toLowerCase() || '';

        const paymentMethod =
          payment.paymentMethod
            ?.toLowerCase() || '';

        const paymentStatus =
          payment.paymentStatus
            ?.toLowerCase() || '';

        const remarks =
          payment.remarks
            ?.toLowerCase() || '';

        const supplierName =
          payment.purchaseOrder?.supplier?.name
            ?.toLowerCase() || '';

        const productName =
          payment.purchaseOrder?.product?.name
            ?.toLowerCase() || '';

        const purchaseOrderId =
          String(
            payment.purchaseOrder?.purchaseOrderId || ''
          );

        const paymentId =
          String(payment.paymentId || '');

        const matchesSearch =
          transactionId.includes(search) ||
          paymentMethod.includes(search) ||
          paymentStatus.includes(search) ||
          remarks.includes(search) ||
          supplierName.includes(search) ||
          productName.includes(search) ||
          purchaseOrderId.includes(search) ||
          paymentId.includes(search);

        const matchesStatus =
          this.selectedStatus === 'ALL' ||
          payment.paymentStatus === this.selectedStatus;

        const matchesMethod =
          this.selectedMethod === 'ALL' ||
          payment.paymentMethod === this.selectedMethod;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesMethod
        );
      });
  }

  // CLEAR FILTERS

  clearFilters(): void {

    this.searchText = '';
    this.selectedStatus = 'ALL';
    this.selectedMethod = 'ALL';

    this.filteredPayments = [...this.payments];
  }

  // SUMMARY

  getTotalPaymentsCount(): number {
    return this.payments.length;
  }

  getSuccessfulPaymentsCount(): number {

    return this.payments.filter(
      payment =>
        payment.paymentStatus === 'SUCCESS'
    ).length;
  }

  getPendingPaymentsCount(): number {

    return this.payments.filter(
      payment =>
        payment.paymentStatus === 'PENDING'
    ).length;
  }

  getFailedPaymentsCount(): number {

    return this.payments.filter(
      payment =>
        payment.paymentStatus === 'FAILED'
    ).length;
  }

  getTotalAmount(): number {

    return this.payments
      .filter(
        payment =>
          payment.paymentStatus === 'SUCCESS'
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );
  }

  // STATUS CLASS

  getStatusClass(status: string): string {

    switch (status?.toUpperCase()) {

      case 'SUCCESS':
        return 'status-success';

      case 'PENDING':
        return 'status-pending';

      case 'FAILED':
        return 'status-failed';

      case 'REFUNDED':
        return 'status-refunded';

      default:
        return 'status-default';
    }
  }

  // PAYMENT METHOD CLASS

  getPaymentMethodClass(method: string): string {

    switch (method?.toUpperCase()) {

      case 'UPI':
        return 'method-upi';

      case 'CREDIT_CARD':
        return 'method-credit';

      case 'DEBIT_CARD':
        return 'method-debit';

      case 'NET_BANKING':
        return 'method-netbanking';

      case 'BANK_TRANSFER':
        return 'method-bank';

      case 'CASH':
        return 'method-cash';

      default:
        return 'method-default';
    }
  }

  // PAYMENT METHOD DISPLAY

  formatPaymentMethod(method: string): string {

    if (!method) {
      return 'N/A';
    }

    return method
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }

  // VIEW PAYMENT

  viewPayment(payment: Payment): void {

    this.selectedPayment = payment;

    this.showPaymentDetails = true;
  }

  // CLOSE DETAILS

  closePaymentDetails(): void {

    this.showPaymentDetails = false;

    this.selectedPayment = null;
  }

  // MAKE PAYMENT

  makePayment(): void {

    this.router.navigate([
      '/admin/make-payment'
    ]);
  }

  // EXPORT EXCEL

  exportExcel(): void {

    this.http
      .get(
        `${this.apiUrl}/export/excel`,
        {
          responseType: 'blob'
        }
      )
      .subscribe({

        next: (blob) => {

          this.downloadFile(
            blob,
            'payment_report.xlsx'
          );

          this.snackBar.open(
            'Payment Excel report downloaded.',
            'Close',
            {
              duration: 3000
            }
          );
        },

        error: (error) => {

          console.error(
            'Excel export failed:',
            error
          );

          this.snackBar.open(
            'Failed to export Excel report.',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }

  // EXPORT PDF

  exportPdf(): void {

    this.http
      .get(
        `${this.apiUrl}/export/pdf`,
        {
          responseType: 'blob'
        }
      )
      .subscribe({

        next: (blob) => {

          this.downloadFile(
            blob,
            'payment_report.pdf'
          );

          this.snackBar.open(
            'Payment PDF report downloaded.',
            'Close',
            {
              duration: 3000
            }
          );
        },

        error: (error) => {

          console.error(
            'PDF export failed:',
            error
          );

          this.snackBar.open(
            'Failed to export PDF report.',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }

  // DOWNLOAD FILE

  private downloadFile(
    blob: Blob,
    fileName: string
  ): void {

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download = fileName;

    link.click();

    window.URL.revokeObjectURL(url);
  }

  // FORMAT DATE

  formatDate(date: string): string {

    if (!date) {
      return 'N/A';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }
  // FORMAT TIME

  formatTime(date: string): string {

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  // SUPPLIER INITIAL
  getSupplierInitial(name: string): string {

    if (!name) {
      return 'S';
    }

    return name
      .charAt(0)
      .toUpperCase();
  }
}