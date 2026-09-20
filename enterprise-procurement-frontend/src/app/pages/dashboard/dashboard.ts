
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',

  imports: [
    DecimalPipe,
    RouterLink,
    DatePipe,
    NgClass
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard implements OnInit {

  userName = localStorage.getItem('name');
  userRole = localStorage.getItem('role');

  userId = Number(
    localStorage.getItem('userId')
  );

  products: any[] = [];

  purchaseRequests: any[] = [];

  recentRequests: any[] = [];

  totalProducts = 0;

  totalRequests = 0;

  pendingRequests = 0;

  totalAmountRequested = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    if (this.userRole === 'USER') {

      this.loadProducts();

      this.loadPurchaseRequests();

    }

  }


  loadProducts(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/products'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Products:',
            response
          );

          this.products = response;

          this.totalProducts =
            response.length;

        },

        error: (error) => {

          console.error(
            'Failed to load products:',
            error
          );

        }

      });

  }


  loadPurchaseRequests(): void {

    if (!this.userId) {

      console.error(
        'User ID not found'
      );

      return;

    }


    this.http
      .get<any[]>(
        `http://localhost:8080/purchaseOrders/user/${this.userId}`
      )
      .subscribe({

        next: (response) => {

          console.log(
            'My Purchase Requests:',
            response
          );

          this.purchaseRequests =
            response;


          this.totalRequests =
            response.length;


          this.pendingRequests =
            response.filter(
              request =>
                request.status === 'CREATED'
            ).length;


          this.totalAmountRequested =
            response.reduce(
              (total, request) =>
                total +
                (request.totalAmount || 0),

              0
            );


          this.recentRequests =
            [...response]
              .sort(
                (a, b) =>
                  b.purchaseOrderId -
                  a.purchaseOrderId
              )
              .slice(0, 5);

        },

        error: (error) => {

          console.error(
            'Failed to load purchase requests:',
            error
          );

        }

      });

  }


  getStatusClass(
    status: string
  ): string {

    return status
      ?.toLowerCase();

  }


  logout(): void {

    localStorage.clear();

    this.router.navigate(
      ['/login']
    );

  }

}
