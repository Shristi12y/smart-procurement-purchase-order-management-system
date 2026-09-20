import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './supplier-dashboard.html',
  styleUrl: './supplier-dashboard.scss'
})
export class SupplierDashboard implements OnInit {

  supplierName = '';

  supplierId: number | null = null;

  loading = true;


  // Purchase Orders
  purchaseOrders: any[] = [];


  // Dashboard counts
  totalOrders = 0;
  createdOrders = 0;
  acceptedOrders = 0;
  packedOrders = 0;
  dispatchedOrders = 0;
  outForDeliveryOrders = 0;
  deliveredOrders = 0;
  totalOrderAmount = 0;
  pendingOrders = 0;
  totalPayment = 0;
  completedPayments = 0;
  pendingPayments = 0;
  supplierRating = 0;
  totalReviews = 0;

constructor(
  private http: HttpClient
) {}
  


  ngOnInit(): void {

    this.loadSupplierDetails();
    this.loadPurchaseOrders();
    this.loadSupplierPayments();

  }

  // SUPPLIER DETAILS

  loadSupplierDetails(): void {

    const id = localStorage.getItem('supplierId');

    const name = localStorage.getItem('name');


    if (id) {

      this.supplierId = Number(id);

    }


    if (name) {

      this.supplierName = name;

    }

  }

  // PURCHASE ORDERS

  loadPurchaseOrders(): void {

  const supplierId =
    localStorage.getItem('supplierId');


  if (!supplierId) {

    console.error(
      'Supplier ID not found in localStorage'
    );

    this.loading = false;

    return;

  }


  this.http
    .get<any[]>(
      `http://localhost:8080/purchaseOrders/supplier/${supplierId}`
    )
    .subscribe({

      next: (orders: any[]) => {

        console.log(
          'Supplier Purchase Orders:',
          orders
        );


        this.purchaseOrders =
          orders || [];


        this.calculateDashboardData();


        this.loading = false;

      },


      error: (error: any) => {

        console.error(
          'Failed to load supplier purchase orders:',
          error
        );


        this.purchaseOrders = [];


        this.calculateDashboardData();


        this.loading = false;

      }

    });

}

// =========================================================
// SUPPLIER PAYMENTS
// =========================================================

loadSupplierPayments(): void {

  const supplierId =
    Number(localStorage.getItem('supplierId'));

  if (!supplierId) {

    console.error(
      'Supplier ID not found in localStorage'
    );

    return;

  }

  this.http
    .get<any[]>(
      'http://localhost:8080/payments'
    )
    .subscribe({

      next: (payments: any[]) => {

        console.log(
          'All Payments:',
          payments
        );

        // Filter payments belonging to this supplier
        const supplierPayments =
          (payments || []).filter(payment => {

            const paymentSupplierId =
              payment.purchaseOrder
                ?.supplier
                ?.supplierId;

            return Number(paymentSupplierId) === supplierId;

          });


        console.log(
          'Supplier Payments:',
          supplierPayments
        );


        // Completed / successful payments

        const successfulPayments =
          supplierPayments.filter(payment =>
            String(payment.paymentStatus)
              .trim()
              .toUpperCase() === 'SUCCESS'
          );


        // Pending payments

        const pendingPayments =
          supplierPayments.filter(payment =>
            String(payment.paymentStatus)
              .trim()
              .toUpperCase() === 'PENDING'
          );


        // Total successful payment amount

        this.totalPayment =
          successfulPayments.reduce(
            (total, payment) =>
              total +
              Number(payment.amount || 0),
            0
          );


        // Payment counts

        this.completedPayments =
          successfulPayments.length;


        this.pendingPayments =
          pendingPayments.length;


        console.log(
          'Total Payment Received:',
          this.totalPayment
        );

        console.log(
          'Completed Payments:',
          this.completedPayments
        );

        console.log(
          'Pending Payments:',
          this.pendingPayments
        );

      },


      error: (error) => {

        console.error(
          'Failed to load supplier payments:',
          error
        );

        this.totalPayment = 0;

        this.completedPayments = 0;

        this.pendingPayments = 0;

      }

    });

}

  // CALCULATE DASHBOARD DATA

  calculateDashboardData(): void {

  this.totalOrders =
    this.purchaseOrders.length;


  this.createdOrders =
    this.purchaseOrders.filter(
      order => order.status === 'CREATED'
    ).length;


  this.acceptedOrders =
    this.purchaseOrders.filter(
      order => order.status === 'ACCEPTED'
    ).length;


  this.packedOrders =
    this.purchaseOrders.filter(
      order => order.status === 'PACKED'
    ).length;


  this.dispatchedOrders =
    this.purchaseOrders.filter(
      order => order.status === 'DISPATCHED'
    ).length;


  this.outForDeliveryOrders =
    this.purchaseOrders.filter(
      order => order.status === 'OUT_FOR_DELIVERY'
    ).length;


  this.deliveredOrders =
    this.purchaseOrders.filter(
      order => order.status === 'DELIVERED'
    ).length;


  // TOTAL ORDER AMOUNT

  this.totalOrderAmount =
    this.purchaseOrders.reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );


  // ======================================
  // PAYMENT CALCULATION
  // ======================================

  const deliveredOrders =
    this.purchaseOrders.filter(
      order => order.status === 'DELIVERED'
    );


  // Payment received = amount of delivered orders

  this.totalPayment =
    deliveredOrders.reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );


  // Completed payments

  this.completedPayments =
    deliveredOrders.length;


  // Pending payments

  this.pendingPayments =
    this.purchaseOrders.filter(
      order =>
        order.status !== 'DELIVERED'
    ).length;


  // Pending orders

  this.pendingOrders =
    this.purchaseOrders.filter(
      order =>
        order.status !== 'DELIVERED'
    ).length;

}

  // STATUS FORMAT

  formatStatus(status: string): string {

    if (!status) {
      return '';
    }


    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }

  // STATUS CLASS

  getStatusClass(status: string): string {

    if (!status) {
      return '';
    }


    return status
      .toLowerCase()
      .replace(/_/g, '-');

  }

  // RECENT ORDERS

  get recentOrders(): any[] {

    return this.purchaseOrders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() -
          new Date(a.orderDate).getTime()
      )
      .slice(0, 5);

  }

}