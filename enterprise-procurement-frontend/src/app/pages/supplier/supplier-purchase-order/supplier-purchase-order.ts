import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-supplier-purchase-order',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './supplier-purchase-order.html',

  styleUrl: './supplier-purchase-order.scss'
})
export class SupplierPurchaseOrder implements OnInit {

  private baseUrl =
    'http://localhost:8080/purchaseOrders';


  // ==========================================
  // SUPPLIER
  // ==========================================

  supplierId: number | null = null;

  supplierName = '';


  // ==========================================
  // ORDERS
  // ==========================================

  orders: any[] = [];

  filteredOrders: any[] = [];


  // ==========================================
  // LOADING
  // ==========================================

  loading = true;


  // ==========================================
  // SEARCH & FILTER
  // ==========================================

  searchText = '';

  selectedStatus = 'ALL';


  // ==========================================
  // STATUS UPDATE
  // ==========================================

  updatingOrderId: number | null = null;


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadSupplierDetails();

    this.loadPurchaseOrders();

  }


  // ==========================================
  // SUPPLIER DETAILS
  // ==========================================

  loadSupplierDetails(): void {

    const id =
      localStorage.getItem('supplierId');

    const name =
      localStorage.getItem('name');


    if (id) {

      this.supplierId =
        Number(id);

    }


    if (name) {

      this.supplierName =
        name;

    }

  }


  // ==========================================
  // LOAD PURCHASE ORDERS
  // ==========================================

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


    this.loading = true;


    this.http
      .get<any[]>(
        `${this.baseUrl}/supplier/${supplierId}`
      )
      .subscribe({

        next: (orders: any[]) => {

          console.log(
            'Supplier Purchase Orders:',
            orders
          );


          this.orders =
            orders || [];


          this.applyFilters();


          this.loading = false;

        },


        error: (error: any) => {

          console.error(
            'Failed to load purchase orders:',
            error
          );


          this.orders = [];

          this.filteredOrders = [];


          this.loading = false;

        }

      });

  }


  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  get pendingOrders(): number {

    return this.orders.filter(
      order =>
        order.status === 'CREATED'
    ).length;

  }


  get inProgressOrders(): number {

    return this.orders.filter(
      order =>
        order.status !== 'CREATED' &&
        order.status !== 'DELIVERED'
    ).length;

  }


  get deliveredOrders(): number {

    return this.orders.filter(
      order =>
        order.status === 'DELIVERED'
    ).length;

  }


  // ==========================================
  // SEARCH
  // ==========================================

  onSearch(): void {

    this.applyFilters();

  }


  // ==========================================
  // STATUS FILTER
  // ==========================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // ==========================================
  // APPLY FILTERS
  // ==========================================

  applyFilters(): void {

    let result =
      [...this.orders];


    // STATUS FILTER

    if (
      this.selectedStatus !== 'ALL'
    ) {

      result =
        result.filter(
          order =>
            order.status ===
            this.selectedStatus
        );

    }


    // SEARCH FILTER

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (search) {

      result =
        result.filter(
          order => {

            const orderId =
              String(
                order.purchaseOrderId || ''
              ).toLowerCase();


            const productName =
              String(
                order.product?.name || ''
              ).toLowerCase();


            const productId =
              String(
                order.product?.productId || ''
              ).toLowerCase();


            const requesterName =
              String(
                order.createdBy?.name || ''
              ).toLowerCase();


            const requesterEmail =
              String(
                order.createdBy?.email || ''
              ).toLowerCase();


            return (

              orderId.includes(search) ||

              productName.includes(search) ||

              productId.includes(search) ||

              requesterName.includes(search) ||

              requesterEmail.includes(search)

            );

          }
        );

    }


    this.filteredOrders =
      result;

  }


  // ==========================================
  // CAN UPDATE STATUS
  // ==========================================

  canUpdateStatus(
    status: string
  ): boolean {

    return (

      status === 'CREATED' ||

      status === 'ACCEPTED' ||

      status === 'PACKED' ||

      status === 'DISPATCHED' ||

      status === 'OUT_FOR_DELIVERY'

    );

  }


  // ==========================================
  // NEXT STATUS
  // ==========================================

  getNextStatus(
    status: string
  ): string | null {

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

      default:
        return null;

    }

  }


  // ==========================================
  // ACTION TEXT
  // ==========================================

  getActionText(
    status: string
  ): string {

    switch (status) {

      case 'CREATED':
        return 'Accept Order';

      case 'ACCEPTED':
        return 'Mark as Packed';

      case 'PACKED':
        return 'Mark as Dispatched';

      case 'DISPATCHED':
        return 'Out for Delivery';

      case 'OUT_FOR_DELIVERY':
        return 'Mark as Delivered';

      case 'DELIVERED':
        return 'Completed';

      default:
        return 'Update';

    }

  }


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  updateStatus(
    order: any
  ): void {

    const nextStatus =
      this.getNextStatus(
        order.status
      );


    if (!nextStatus) {

      return;

    }


    const confirmed =
      confirm(
        `Are you sure you want to change Order #${order.purchaseOrderId} from ${this.formatStatus(order.status)} to ${this.formatStatus(nextStatus)}?`
      );


    if (!confirmed) {

      return;

    }


    this.updatingOrderId =
      order.purchaseOrderId;


    this.http
      .put<any>(
        `${this.baseUrl}/${order.purchaseOrderId}/status`,
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
            'Purchase Order Updated:',
            updatedOrder
          );


          const index =
            this.orders.findIndex(
              existingOrder =>
                existingOrder.purchaseOrderId ===
                order.purchaseOrderId
            );


          if (index !== -1) {

            this.orders[index] =
              updatedOrder;

          }


          this.applyFilters();


          this.updatingOrderId =
            null;


          alert(
            `Order #${order.purchaseOrderId} updated successfully.`
          );

        },


        error: (error: any) => {

          console.error(
            'Failed to update order:',
            error
          );


          this.updatingOrderId =
            null;


          alert(
            error.error?.message ||
            'Failed to update purchase order status.'
          );

        }

      });

  }


  // ==========================================
  // CHECK UPDATING
  // ==========================================

  isUpdating(
    purchaseOrderId: number
  ): boolean {

    return (
      this.updatingOrderId ===
      purchaseOrderId
    );

  }


  // ==========================================
  // FORMAT STATUS
  // ==========================================

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '';

    }


    return status

      .replace(/_/g, ' ')

      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

  getStatusClass(
    status: string
  ): string {

    if (!status) {

      return '';

    }


    return status

      .toLowerCase()

      .replace(/_/g, '-');

  }

}