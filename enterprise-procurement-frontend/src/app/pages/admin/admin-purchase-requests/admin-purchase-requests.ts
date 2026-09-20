import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-admin-purchase-requests',
  standalone: true,

  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
    NgClass,
    MatIconModule
  ],

  templateUrl: './admin-purchase-requests.html',
  styleUrl: './admin-purchase-requests.scss'
})
export class AdminPurchaseRequests implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];
  loading = false;
  searchText = '';
  selectedStatus = 'ALL';
  showOrderDetails = false;
  selectedOrder: any = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {

    this.getAllPurchaseOrders();

  }

  // GET ALL PURCHASE ORDERS

  getAllPurchaseOrders(): void {

    this.loading = true;

    this.http
      .get<any[]>(
        'http://localhost:8080/purchaseOrders'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Admin Purchase Orders:',
            response
          );

          this.orders = response || [];

          this.filteredOrders =
            this.orders;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to fetch purchase orders:',
            error
          );

          this.loading = false;

        }

      });

  }

  // FILTER ORDERS

  filterOrders(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredOrders =
      this.orders.filter(order => {


        const orderId =
          order.purchaseOrderId
            ?.toString()
            .toLowerCase()
            || '';


        const productName =
          order.product?.name
            ?.toLowerCase()
            || '';


        const supplierName =
          order.supplier?.name
            ?.toLowerCase()
            || '';


        const userName =
          order.createdBy?.name
            ?.toLowerCase()
            || '';


        const status =
          order.status
            ?.toLowerCase()
            || '';


        const matchesSearch =

          orderId.includes(search) ||

          productName.includes(search) ||

          supplierName.includes(search) ||

          userName.includes(search);


        const matchesStatus =

          this.selectedStatus === 'ALL' ||

          order.status ===
          this.selectedStatus;


        return (

          matchesSearch &&
          matchesStatus

        );

      });

  }

  // CLEAR FILTERS

  clearFilters(): void {

    this.searchText = '';

    this.selectedStatus = 'ALL';

    this.filteredOrders =
      this.orders;

  }

  // SUMMARY COUNTS

  getTotalRequestsCount(): number {

    return this.orders.length;

  }


  getCreatedRequestsCount(): number {

    return this.orders.filter(
      order =>
        order.status === 'CREATED'
    ).length;

  }


  getAcceptedRequestsCount(): number {

    return this.orders.filter(
      order =>
        order.status === 'ACCEPTED'
    ).length;

  }


  getDeliveredRequestsCount(): number {

    return this.orders.filter(
      order =>
        order.status === 'DELIVERED'
    ).length;

  }

  // STATUS CLASS

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'CREATED':
        return 'status-created';


      case 'ACCEPTED':
        return 'status-accepted';


      case 'PACKED':
        return 'status-packed';


      case 'DISPATCHED':
        return 'status-dispatched';


      case 'OUT_FOR_DELIVERY':
        return 'status-out-for-delivery';


      case 'DELIVERED':
        return 'status-delivered';


      default:
        return 'status-default';

    }

  }


  // FORMAT STATUS

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '';

    }

    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }


  // CHECK CREATED STATUS

  isCreated(
    order: any
  ): boolean {

    return order?.status === 'CREATED';

  }


  // VIEW ORDER DETAILS

  viewOrder(
    order: any
  ): void {

    this.selectedOrder =
      order;

    this.showOrderDetails =
      true;

  }


  // CLOSE DETAILS

  closeOrderDetails(): void {

    this.showOrderDetails =
      false;

    this.selectedOrder =
      null;

  }


  updateOrderStatus(order: any, nextStatus: string): void {

  const orderId = order.purchaseOrderId;

  if (!orderId) {
    console.error('Purchase Order ID not found.');
    return;
  }

  console.log(
    `Updating Order ${orderId} from ${order.status} to ${nextStatus}`
  );

  this.http.put(
    `http://localhost:8080/purchaseOrders/${orderId}/status`,
    null,
    {
      params: {
        status: nextStatus
      }
    }
  )
  .subscribe({

    next: (updatedOrder: any) => {

      console.log(
        'Order status updated:',
        updatedOrder
      );

      // Update the order in the local list
      const index = this.orders.findIndex(
        o => o.purchaseOrderId === orderId
      );

      if (index !== -1) {
        this.orders[index] = updatedOrder;
      }

      // Refresh filtered list
      this.filterOrders();

      this.snackBar.open(
        `Order #${orderId} moved to ${this.formatStatus(nextStatus)}.`,
        'Close',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    },

    error: (error) => {

      console.error(
        'Failed to update order status:',
        error
      );

      this.snackBar.open(
        error.error?.message ||
        'Failed to update order status.',
        'Close',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    }

  });

}

getNextStatus(status: string): string | null {

  switch (status) {

    case 'CREATED':
      return 'ACCEPTED';

    case 'ACCEPTED':
      return 'PACKED';

    case 'PACKED':
      return 'DISPATCHED';

    case 'DISPATCHED':
      return 'OUT_FOR_DELIVERY';

    case 'OUT_FOR_DELIVERY':
      return 'DELIVERED';

    case 'DELIVERED':
      return null;

    default:
      return null;
  }

}

getNextStatusLabel(status: string): string {

  switch (status) {

    case 'CREATED':
      return 'Accept';

    case 'ACCEPTED':
      return 'Mark as Packed';

    case 'PACKED':
      return 'Dispatch';

    case 'DISPATCHED':
      return 'Out for Delivery';

    case 'OUT_FOR_DELIVERY':
      return 'Mark as Delivered';

    case 'DELIVERED':
      return 'Delivered';

    default:
      return 'Update Status';
  }
}

acceptOrder(order: any): void {

  const dialogRef = this.dialog.open(
    ConfirmDialog,
    {
      width: '420px',

      data: {

        title: 'Accept Purchase Request',
        message:
        `Do you want to accept Purchase Order #${order.purchaseOrderId}?`,
        icon: 'check_circle',
        confirmText: 'Accept',
        cancelText: 'Cancel'
      }
    }
  );

  dialogRef.afterClosed().subscribe(
    (confirmed) => {

      if (!confirmed) {
        return;
      }

      this.http.put(
        `http://localhost:8080/purchaseOrders/${order.purchaseOrderId}/status?status=ACCEPTED`,
        {}
      )
      .subscribe({

        next: (updatedOrder: any) => {

          console.log(
            'Purchase Order Accepted:',
            updatedOrder
          );

          /*
           * Update the order in the local array
           */

          const index =
            this.orders.findIndex(
              item =>
                item.purchaseOrderId ===
                updatedOrder.purchaseOrderId
            );

          if (index !== -1) {

            this.orders[index] =
              updatedOrder;

          }


          /** Re-apply filters*/

          this.filterOrders();

          if (
            this.selectedOrder &&
            this.selectedOrder.purchaseOrderId ===
            updatedOrder.purchaseOrderId
          ) {

            this.selectedOrder =
              updatedOrder;

          }


          /*
           * Success message
           */

          this.snackBar.open(
            'Purchase request accepted successfully!',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );

        },

        error: (error) => {

          console.error(
            'Failed to accept purchase request:',
            error
          );


          this.snackBar.open(
            error.error?.message ||
            'Failed to accept purchase request.',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );

        }

      });

    }
  );

}

}