
import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-payment-history',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  
  

  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss'
})
export class PaymentHistory implements OnInit, OnDestroy {

  payments: any[] = [];
  filteredPayments: any[] = [];

  loading = false;

  searchText = '';
  selectedStatus = 'ALL';
  totalPaid = 0;
  successfulPayments = 0;
  totalTransactions = 0;
  averagePayment = 0;
  monthlyPayments: any[] = [];
  maxMonthlyPayment = 0;
  paymentChart: Chart | undefined;

monthlyPaymentLabels: string[] = [];
monthlyPaymentAmounts: number[] = [];


  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {

    this.getPaymentHistory();

  }
  ngOnDestroy(): void {

  if (this.paymentChart) {

    this.paymentChart.destroy();

  }

}


  /* =========================================================
     GET PAYMENT HISTORY
  ========================================================= */

  getPaymentHistory(): void {

    this.loading = true;

    this.http.get<any[]>(
      'http://localhost:8080/payments'
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Payment History:',
          response
        );

        this.payments = response || [];

        this.filteredPayments = [
          ...this.payments
        ];

        this.calculateSummary();

        this.calculateMonthlyPayments();

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load payment history:',
          error
        );

        this.loading = false;

        this.showMessage(
          'Failed to load payment history.',
          'error'
        );

      }

    });

  }


  /* =========================================================
     SUMMARY CALCULATION
  ========================================================= */

  calculateSummary(): void {

    const successful =
      this.payments.filter(
        payment =>
          payment.paymentStatus === 'SUCCESS'
      );

    this.successfulPayments =
      successful.length;

    this.totalTransactions =
      this.payments.length;

    this.totalPaid =
      successful.reduce(
        (total, payment) =>
          total + (payment.amount || 0),
        0
      );

    this.averagePayment =
      this.successfulPayments > 0
        ? this.totalPaid / this.successfulPayments
        : 0;

  }


  /*  MONTHLY PAYMENT CALCULATION */

  calculateMonthlyPayments(): void {

  const monthlyMap: { [key: string]: number } = {};

  this.payments.forEach(payment => {

    // Only successful payments
    if (
      String(payment.paymentStatus)
        .trim()
        .toUpperCase() !== 'SUCCESS'
    ) {
      return;
    }

    if (!payment.paymentDate) {
      return;
    }

    const date = new Date(payment.paymentDate);

    if (isNaN(date.getTime())) {
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth();

    const key =
      `${year}-${String(month + 1).padStart(2, '0')}`;

    monthlyMap[key] =
      (monthlyMap[key] || 0) +
      Number(payment.amount || 0);

  });


  // Sort months properly
  const sortedKeys =
    Object.keys(monthlyMap).sort();


  this.monthlyPaymentLabels =
    sortedKeys.map(key => {

      const [year, month] =
        key.split('-');

      const date =
        new Date(
          Number(year),
          Number(month) - 1,
          1
        );

      return date.toLocaleDateString(
        'en-IN',
        {
          month: 'short',
          year: 'numeric'
        }
      );

    });


  this.monthlyPaymentAmounts =
    sortedKeys.map(
      key => monthlyMap[key]
    );


  console.log(
    'Monthly Labels:',
    this.monthlyPaymentLabels
  );

  console.log(
    'Monthly Amounts:',
    this.monthlyPaymentAmounts
  );


  // Create chart after canvas is available
  setTimeout(() => {

    this.createPaymentChart();

  }, 100);

}

createPaymentChart(): void {

  const canvas =
    document.getElementById(
      'monthlyPaymentChart'
    ) as HTMLCanvasElement;

  if (!canvas) {
    return;
  }

  if (this.paymentChart) {
    this.paymentChart.destroy();
  }

  this.paymentChart =
    new Chart(canvas, {

      type: 'bar',

      data: {

        labels:
          this.monthlyPaymentLabels,

        datasets: [

          {
            label: 'Payment Amount',

            data:
              this.monthlyPaymentAmounts,

            backgroundColor: '#4f46e5',

            borderColor: '#4f46e5',

            borderWidth: 1,

            borderRadius: 6,

            barPercentage: 0.65,

            categoryPercentage: 0.7
          }

        ]
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          },

          tooltip: {

            callbacks: {

              label: (context) => {

                const value =
                  Number(context.raw || 0);

                return (
                  ' Payment: ₹' +
                  value.toLocaleString('en-IN')
                );

              }

            }

          }

        },

        scales: {

          x: {

            grid: {
              display: false
            },

            ticks: {

              font: {
                size: 12
              }

            }

          },

          y: {

            beginAtZero: true,

            grid: {

              display: true
            },

            ticks: {

              callback: (value) => {

                const amount =
                  Number(value);

                if (amount >= 10000000) {

                  return (
                    '₹' +
                    (amount / 10000000)
                      .toFixed(1) +
                    'Cr'
                  );

                }

                if (amount >= 100000) {

                  return (
                    '₹' +
                    (amount / 100000)
                      .toFixed(1) +
                    'L'
                  );

                }

                if (amount >= 1000) {

                  return (
                    '₹' +
                    (amount / 1000)
                      .toFixed(1) +
                    'K'
                  );

                }

                return '₹' + amount;

              }

            }

          }

        }

      }

    });

}


  /* =========================================================
     SEARCH
  ========================================================= */

  onSearch(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredPayments =
      this.payments.filter(payment => {

        const paymentId =
          payment.paymentId
            ?.toString()
            .toLowerCase() || '';

        const poId =
          payment.purchaseOrder
            ?.purchaseOrderId
            ?.toString()
            .toLowerCase() || '';

        const productName =
          payment.purchaseOrder
            ?.product
            ?.name
            ?.toLowerCase() || '';

        const transactionId =
          payment.transactionId
            ?.toLowerCase() || '';


        return (

          paymentId.includes(search) ||

          poId.includes(search) ||

          productName.includes(search) ||

          transactionId.includes(search)

        );

      });


    this.applyStatusFilter();

  }


  /* =========================================================
     STATUS FILTER
  ========================================================= */

  onStatusChange(): void {

    this.onSearch();

  }


  applyStatusFilter(): void {

    if (
      this.selectedStatus === 'ALL'
    ) {

      return;

    }


    this.filteredPayments =
      this.filteredPayments.filter(
        payment =>
          payment.paymentStatus ===
          this.selectedStatus
      );

  }


  /* =========================================================
     STATUS CLASS
  ========================================================= */

  getStatusClass(
    status: string
  ): string {

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


  /* =========================================================
     PAYMENT METHOD
  ========================================================= */

  getPaymentMethodLabel(
    method: string
  ): string {

    if (!method) {

      return 'N/A';

    }

    return method.replace(
      /_/g,
      ' '
    );

  }


  /* =========================================================
     DATE FORMAT
  ========================================================= */

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


  /* =========================================================
     CURRENCY FORMAT
  ========================================================= */

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
    ).format(
      amount || 0
    );

  }


  /* =========================================================
     EXPORT EXCEL
  ========================================================= */

  exportExcel(): void {

    this.http.get(
      'http://localhost:8080/payments/export/excel',
      {
        responseType: 'blob'
      }
    )
    .subscribe({

      next: (response: Blob) => {

        const url =
          window.URL.createObjectURL(
            response
          );

        const link =
          document.createElement('a');

        link.href = url;

        link.download =
          'payment_history.xlsx';

        link.click();

        window.URL.revokeObjectURL(
          url
        );

      },

      error: (error) => {

        console.error(
          'Excel export failed:',
          error
        );

        this.showMessage(
          'Failed to export Excel report.',
          'error'
        );

      }

    });

  }


  /* =========================================================
     EXPORT PDF
  ========================================================= */

  exportPdf(): void {

    this.http.get(
      'http://localhost:8080/payments/export/pdf',
      {
        responseType: 'blob'
      }
    )
    .subscribe({

      next: (response: Blob) => {

        const url =
          window.URL.createObjectURL(
            response
          );

        const link =
          document.createElement('a');

        link.href = url;

        link.download =
          'payment_history.pdf';

        link.click();

        window.URL.revokeObjectURL(
          url
        );

      },

      error: (error) => {

        console.error(
          'PDF export failed:',
          error
        );

        this.showMessage(
          'Failed to export PDF report.',
          'error'
        );

      }

    });

  }


  /* =========================================================
     SNACKBAR
  ========================================================= */

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

}

