import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  DecimalPipe,
  DatePipe,
  NgClass
} from '@angular/common';

@Component({

  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    DecimalPipe,
    DatePipe,
    NgClass
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  adminName =
    localStorage.getItem('name') ||
    'Administrator';

  users: any[] = [];

  suppliers: any[] = [];

  products: any[] = [];

  purchaseOrders: any[] = [];

  approvalRequests: any[] = [];

  totalUsers = 0;

  totalSuppliers = 0;

  totalProducts = 0;

  totalPurchaseOrders = 0;

  pendingApprovals = 0;

  createdOrders = 0;

  acceptedOrders = 0;

  packedOrders = 0;

  dispatchedOrders = 0;

  outForDeliveryOrders = 0;

  deliveredOrders = 0;

  recentOrders: any[] = [];

  loading = true;


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    this.loadDashboardData();

  }


  /* LOAD DASHBOARD DATA*/

  loadDashboardData(): void {

    this.loading = true;


    this.loadUsers();

    this.loadSuppliers();

    this.loadProducts();

    this.loadPurchaseOrders();

    this.loadApprovalRequests();

  }


  /* USERS*/

  loadUsers(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/admin/users'
      )
      .subscribe({

        next: (response) => {

          this.users = response || [];

          this.totalUsers =
            this.users.length;

        },

        error: (error) => {

          console.error(
            'Failed to load users:',
            error
          );

        }

      });

  }


  /* SUPPLIERS*/

  loadSuppliers(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/suppliers'
      )
      .subscribe({

        next: (response) => {

          this.suppliers =
            response || [];

          this.totalSuppliers =
            this.suppliers.length;

        },

        error: (error) => {

          console.error(
            'Failed to load suppliers:',
            error
          );

        }

      });

  }


  /* PRODUCTS*/

  loadProducts(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/products'
      )
      .subscribe({

        next: (response) => {

          this.products =
            response || [];

          this.totalProducts =
            this.products.length;

        },

        error: (error) => {

          console.error(
            'Failed to load products:',
            error
          );

        }

      });

  }


  /*  PURCHASE ORDERS*/

  loadPurchaseOrders(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/purchaseOrders'
      )
      .subscribe({

        next: (response) => {

          this.purchaseOrders =
            response || [];


          this.totalPurchaseOrders =
            this.purchaseOrders.length;


          this.calculateOrderStatuses();


          this.recentOrders =
            [...this.purchaseOrders]
              .sort(
                (a, b) =>
                  (b.purchaseOrderId || 0) -
                  (a.purchaseOrderId || 0)
              )
              .slice(0, 5);

        },

        error: (error) => {

          console.error(
            'Failed to load purchase orders:',
            error
          );

        }

      });

  }


  /*  APPROVAL REQUESTS */

  loadApprovalRequests(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/approvalRequests'
      )
      .subscribe({

        next: (response) => {

          this.approvalRequests =
            response || [];


          this.pendingApprovals =
            this.approvalRequests
              .filter(
                request =>
                  request.status === 'PENDING'
              )
              .length;


          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load approval requests:',
            error
          );

          this.loading = false;

        }

      });

  }


  /*  ORDER STATUS CALCULATION*/

  calculateOrderStatuses(): void {

    this.createdOrders = 0;

    this.acceptedOrders = 0;

    this.packedOrders = 0;

    this.dispatchedOrders = 0;

    this.outForDeliveryOrders = 0;

    this.deliveredOrders = 0;


    this.purchaseOrders.forEach(
      order => {

        switch (order.status) {

          case 'CREATED':

            this.createdOrders++;

            break;


          case 'ACCEPTED':

            this.acceptedOrders++;

            break;


          case 'PACKED':

            this.packedOrders++;

            break;


          case 'DISPATCHED':

            this.dispatchedOrders++;

            break;


          case 'OUT_FOR_DELIVERY':

            this.outForDeliveryOrders++;

            break;


          case 'DELIVERED':

            this.deliveredOrders++;

            break;

        }

      }
    );

  }


  /* STATUS CLASS */

  getStatusClass(
    status: string
  ): string {

    return status
      ?.toLowerCase()
      .replace(/_/g, '-');

  }


  /* FORMAT STATUS */

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '';

    }


    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }

}