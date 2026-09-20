import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-payments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './supplier-payments.html',
  styleUrl: './supplier-payments.scss'
})
export class SupplierPayments implements OnInit {

  payments: any[] = [];
  filteredPayments: any[] = [];

  loading = false;

  searchText = '';
  selectedStatus = 'ALL';
  supplierId = 1;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.getPayments();

  }


  // GET SUPPLIER PAYMENTS

  getPayments(): void {

    this.loading = true;

    this.http.get<any[]>(
      `http://localhost:8080/payments/supplier/${this.supplierId}`
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Supplier Payments:',
          response
        );

        this.payments = response || [];

        this.filteredPayments = [
          ...this.payments
        ];

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load payments:',
          error
        );

        this.loading = false;

        this.showMessage(
          'Failed to load payments.',
          'error'
        );

      }

    });

  }

  // SEARCH

  onSearch(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    this.filteredPayments =
      this.payments.filter(payment => {

        const poId =
          payment.purchaseOrder?.purchaseOrderId
            ?.toString()
            .toLowerCase() || '';

        const productName =
          payment.purchaseOrder?.product?.name
            ?.toLowerCase() || '';

        const transactionId =
          payment.transactionId
            ?.toLowerCase() || '';

        return (
          poId.includes(search) ||
          productName.includes(search) ||
          transactionId.includes(search)
        );

      });

    this.applyStatusFilter();

  }

  // STATUS FILTER

  onStatusChange(): void {

    this.onSearch();

  }


  applyStatusFilter(): void {

    if (this.selectedStatus === 'ALL') {

      return;

    }

    this.filteredPayments =
      this.filteredPayments.filter(
        payment =>
          payment.paymentStatus ===
          this.selectedStatus
      );

  }

  // PAYMENT STATUS CLASS

  getStatusClass(status: string): string {

    switch (status) {

      case 'SUCCESS':
        return 'status-success';

      case 'PENDING':
        return 'status-pending';

      case 'FAILED':
        return 'status-failed';

      case 'REFUNDED':
        return 'status-refunded';

      default:
        return '';

    }

  }


  // PAYMENT METHOD LABEL

  getPaymentMethodLabel(
    method: string
  ): string {

    if (!method) {
      return 'N/A';
    }

    return method
      .replace(/_/g, ' ');

  }

  // FORMAT DATE

  formatDate(
    date: string
  ): string {

    if (!date) {
      return 'N/A';
    }

    return new Date(date)
      .toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

  }

  // FORMAT CURRENCY

  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      }
    ).format(amount || 0);

  }

// PAYMENT SUMMARY

getTotalAmount(): number {

  return this.payments
    .filter(payment => payment.paymentStatus === 'SUCCESS')
    .reduce(
      (total, payment) =>
        total + (payment.amount || 0),
      0
    );

}

getSuccessfulCount(): number {

  return this.payments.filter(
    payment =>
      payment.paymentStatus === 'SUCCESS'
  ).length;

}

getPendingCount(): number {

  return this.payments.filter(
    payment =>
      payment.paymentStatus === 'PENDING'
  ).length;

}

getFailedCount(): number {

  return this.payments.filter(
    payment =>
      payment.paymentStatus === 'FAILED'
  ).length;

}  

  // SNACKBAR

  showMessage(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass:
          type === 'success'
            ? ['success-snackbar']
            : ['error-snackbar']
      }
    );

  }

// EXPORT PAYMENT REPORT - EXCEL

exportExcel(): void {

  this.http.get(
    'http://localhost:8080/payments/export/excel',
    {
      responseType: 'blob'
    }
  ).subscribe({

    next: (blob) => {

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'supplier_payment_report.xlsx';

      link.click();

      window.URL.revokeObjectURL(url);

      this.showMessage(
        'Payment report exported to Excel successfully.',
        'success'
      );

    },

    error: (error) => {

      console.error(
        'Failed to export Excel:',
        error
      );

      this.showMessage(
        'Failed to export Excel report.',
        'error'
      );

    }

  });

}

// EXPORT PAYMENT REPORT - PDF

exportPdf(): void {

  this.http.get(
    'http://localhost:8080/payments/export/pdf',
    {
      responseType: 'blob'
    }
  ).subscribe({

    next: (blob) => {

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'supplier_payment_report.pdf';

      link.click();

      window.URL.revokeObjectURL(url);

      this.showMessage(
        'Payment report exported to PDF successfully.',
        'success'
      );

    },

    error: (error) => {

      console.error(
        'Failed to export PDF:',
        error
      );

      this.showMessage(
        'Failed to export PDF report.',
        'error'
      );

    }

  });

}

}