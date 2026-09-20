import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  DatePipe,
  DecimalPipe,
  NgClass
} from '@angular/common';

@Component({
  selector: 'app-purchase-request',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './purchase-request.html',
  styleUrl: './purchase-request.scss'
})
export class PurchaseRequest implements OnInit {

  // -----------------------------
  // MODE
  // -----------------------------

  isMyRequestsPage = false;


  // -----------------------------
  // CREATE REQUEST DATA
  // -----------------------------

  products: any[] = [];

  selectedProductId: number | null = null;

  quantity: number | null = null;

  selectedProduct: any = null;

  autoSelectedProductId: number | null = null;

  loading = false;


  // -----------------------------
  // USER
  // -----------------------------

  userId: number | null = null;


  // -----------------------------
  // MY REQUESTS DATA
  // -----------------------------

  purchaseRequests: any[] = [];

  requestsLoading = false;


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    const storedUserId =
      localStorage.getItem('userId');

    if (storedUserId) {

      this.userId = Number(storedUserId);

    }

    console.log(
      'Logged-in User ID:',
      this.userId
    );


    // Check current route
    this.route.url.subscribe(url => {

      this.isMyRequestsPage =
        url.some(segment =>
          segment.path === 'my-requests'
        );

      if (this.isMyRequestsPage) {

        this.getMyPurchaseRequests();

      } else {

        this.readProductFromUrl();

        this.getProducts();

      }

    });

  }


  
  // READ AUTO-SELECT PRODUCT FROM URL

  readProductFromUrl(): void {

    this.route.queryParams.subscribe(
      params => {

        if (params['productId']) {

          this.autoSelectedProductId =
            Number(params['productId']);

          console.log(
            'Auto-selected Product ID:',
            this.autoSelectedProductId
          );

        }

      }
    );

  }

  // GET PRODUCTS

  getProducts(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/products'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Products received:',
            response
          );

          this.products = response;


          // Auto-select product
          if (this.autoSelectedProductId) {

            const productExists =
              this.products.find(
                product =>
                  product.productId ===
                  this.autoSelectedProductId
              );


            if (productExists) {

              this.selectedProductId =
                this.autoSelectedProductId;

              this.onProductChange();

            } else {

              console.error(
                'Product not found:',
                this.autoSelectedProductId
              );

              alert(
                'The selected product is no longer available.'
              );

            }

          }

        },

        error: (error) => {

          console.error(
            'Failed to fetch products:',
            error
          );

        }

      });

  }

  // PRODUCT CHANGE

  onProductChange(): void {

    this.selectedProduct =
      this.products.find(
        product =>
          product.productId ===
          Number(this.selectedProductId)
      );

    console.log(
      'Selected Product:',
      this.selectedProduct
    );

  }


  // CREATE PURCHASE REQUEST

  createPurchaseRequest(): void {

    if (!this.selectedProductId) {

      alert('Please select a product.');

      return;

    }


    if (
      !this.quantity ||
      this.quantity <= 0
    ) {

      alert(
        'Please enter a valid quantity.'
      );

      return;

    }


    if (!this.userId) {

      alert(
        'User ID not found. Please login again.'
      );

      return;

    }


    const product =
      this.products.find(
        product =>
          product.productId ===
          Number(this.selectedProductId)
      );

        if (!product) {
            alert('Selected product not found.');
          return;
        }
        if (
          this.quantity >
          product.numberOfQuantities
        ) {
          alert(
                `Only ${product.numberOfQuantities} items are available in stock.`
              );
            return;
          }

    const supplierId =
      product.supplier?.supplierId;


    if (!supplierId) {

      alert(
        'Supplier is not assigned to this product.'
      );

      return;

    }


    const purchaseOrderData = {

      product: {
        productId:
          Number(this.selectedProductId)
      },

      supplier: {
        supplierId:
          supplierId
      },

      createdBy: {
        userId:
          this.userId
      },

      quantity:
        this.quantity

    };


    console.log(
      'Creating Purchase Request:',
      purchaseOrderData
    );


    this.loading = true;


    this.http.post(
      'http://localhost:8080/purchaseOrders',
      purchaseOrderData
    ).subscribe({

      next: (response) => {

        console.log(
          'Purchase Request created:',
          response
        );

        alert(
          'Purchase Request created successfully!'
        );

        this.router.navigate(
          ['/my-requests']
        );

      },

      error: (error) => {

        console.error(
          'Failed to create Purchase Request:',
          error
        );

        alert(
          error.error?.message ||
          'Failed to create Purchase Request.'
        );

        this.loading = false;

      }

    });

  }


  // GET ALL MY PURCHASE REQUESTS

  getMyPurchaseRequests(): void {

    if (!this.userId) {

      console.error(
        'User ID not found.'
      );

      return;

    }


    this.requestsLoading = true;


    this.http.get<any[]>(
      `http://localhost:8080/purchaseOrders/user/${this.userId}`
    ).subscribe({

      next: (response) => {

        console.log(
          'My Purchase Requests:',
          response
        );

        this.purchaseRequests = response;

        this.requestsLoading = false;

      },

      error: (error) => {

        console.error(
          'Failed to fetch purchase requests:',
          error
        );

        this.requestsLoading = false;

      }

    });

  }

getPendingRequestsCount(): number {

  return this.purchaseRequests.filter(
    request => request.status === 'PENDING'
  ).length;

}


getDeliveredRequestsCount(): number {

  return this.purchaseRequests.filter(
    request => request.status === 'DELIVERED'
  ).length;

}

  // STATUS CSS CLASS

  getStatusClass(status: string): string {

    switch (status?.toUpperCase()) {

      case 'PENDING':
        return 'status-pending';

      case 'APPROVED':
        return 'status-approved';

      case 'PROCESSING':
        return 'status-processing';

      case 'DELIVERED':
        return 'status-delivered';

      case 'REJECTED':
        return 'status-rejected';

      default:
        return 'status-default';

    }

  }

}