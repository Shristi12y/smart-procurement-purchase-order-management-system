import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  DatePipe,
  DecimalPipe,
  NgClass
} from '@angular/common';


@Component({
  selector: 'app-my-orders',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    NgClass
  ],

  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss'
})
export class MyOrders implements OnInit {

  userId: number | null = null;
  orders: any[] = [];
  filteredOrders: any[] = [];
  loading = false;
  searchText = '';
  selectedStatus = 'ALL';
  showOrderDetails = false;
  
  ratedOrderIds = new Set<number>();
  showRatingModal = false;
  selectedOrder: any = null;
  selectedRating = 0;
  ratingRemark = '';
  ratingSubmitting = false;

  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    const storedUserId =
      localStorage.getItem('userId');


    if (storedUserId) {

      this.userId =
        Number(storedUserId);

    }


    console.log(
      'Logged-in User ID:',
      this.userId
    );


    this.getMyOrders();
    this.getMyRatings();

  }

  // GET MY ORDERS

  getMyOrders(): void {

    if (!this.userId) {

      console.error(
        'User ID not found.'
      );

      return;

    }


    this.loading = true;


    this.http.get<any[]>(
      `http://localhost:8080/purchaseOrders/user/${this.userId}`
    )
    .subscribe({

      next: (response) => {

        console.log(
          'My Orders:',
          response
        );


        this.orders = response;

        this.filteredOrders = response;


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Failed to fetch orders:',
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


        const status =
          order.status
            ?.toLowerCase()
            || '';


        const matchesSearch =

          orderId.includes(search) ||

          productName.includes(search) ||

          supplierName.includes(search);


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

  // SUMMARY COUNTS

  getCreatedOrdersCount(): number {

    return this.orders.filter(
      order =>
        order.status === 'CREATED'
    ).length;

  }


  getInProgressOrdersCount(): number {

    return this.orders.filter(
      order =>

        order.status === 'ACCEPTED' ||

        order.status === 'PACKED' ||

        order.status === 'DISPATCHED' ||

        order.status ===
        'OUT_FOR_DELIVERY'

    ).length;

  }


  getDeliveredOrdersCount(): number {

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
// ORDER DETAILS / TRACKING



orderTrackingSteps = [

  {
    status: 'CREATED',
    label: 'Order Created',
    icon: '📋'
  },

  {
    status: 'ACCEPTED',
    label: 'Order Accepted',
    icon: '✓'
  },

  {
    status: 'PACKED',
    label: 'Order Packed',
    icon: '📦'
  },

  {
    status: 'DISPATCHED',
    label: 'Order Dispatched',
    icon: '🚚'
  },

  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out For Delivery',
    icon: '🛵'
  },

  {
    status: 'DELIVERED',
    label: 'Delivered',
    icon: '✓'
  }

];
// OPEN ORDER DETAILS

openOrderDetails(order: any): void {

  this.selectedOrder = order;

  this.showOrderDetails = true;

}

// CLOSE ORDER DETAILS
closeOrderDetails(): void {

  this.showOrderDetails = false;

  this.selectedOrder = null;

}

// GET CURRENT ORDER STATUS INDEX

getCurrentStatusIndex(status: string): number {

  return this.orderTrackingSteps.findIndex(
    step => step.status === status
  );

}

// CHECK COMPLETED STEP

isStepCompleted(
  stepStatus: string,
  currentStatus: string
): boolean {

  const stepIndex =
    this.getCurrentStatusIndex(stepStatus);

  const currentIndex =
    this.getCurrentStatusIndex(currentStatus);

  return stepIndex <= currentIndex;

}
// CHECK CURRENT STEP

isCurrentStep(
  stepStatus: string,
  currentStatus: string
): boolean {

  return stepStatus === currentStatus;

}

// RATING

isDelivered(order: any): boolean {

  return order?.status === 'DELIVERED';

}

// CHECK WHETHER ORDER IS ALREADY RATED

isOrderRated(order: any): boolean {

  return this.ratedOrderIds.has(
    Number(order.purchaseOrderId)
  );

}

// OPEN RATING MODAL

openRatingModal(order: any): void {

  if (!this.isDelivered(order)) {

    alert(
      'You can rate a product only after it has been delivered.'
    );

    return;

  }


  if (this.isOrderRated(order)) {

    alert(
      'You have already rated this order.'
    );

    return;

  }


  this.selectedOrder = order;

  this.selectedRating = 0;

  this.ratingRemark = '';

  this.showRatingModal = true;

}

// CLOSE RATING MODAL

closeRatingModal(): void {

  this.showRatingModal = false;

  this.selectedRating = 0;

  this.ratingRemark = '';

}

// SELECT STAR RATING

selectRating(rating: number): void {

  this.selectedRating = rating;

}

// GET RATING TEXT

getRatingText(): string {

  switch (this.selectedRating) {

    case 1:
      return 'Poor';

    case 2:
      return 'Fair';

    case 3:
      return 'Good';

    case 4:
      return 'Very Good';

    case 5:
      return 'Excellent';

    default:
      return 'Select your rating';

  }

}

// SUBMIT RATING

submitRating(): void {

  if (!this.selectedOrder) {

    return;

  }


  if (this.selectedRating < 1) {

    alert(
      'Please select a rating.'
    );

    return;

  }


  const ratingData = {

    purchaseOrder: {

      purchaseOrderId:
        this.selectedOrder.purchaseOrderId

    },

    rating:
      this.selectedRating,

    remark:
      this.ratingRemark.trim()

  };


  console.log(
    'Submitting Rating:',
    ratingData
  );


  this.ratingSubmitting = true;


  this.http.post(
    'http://localhost:8080/rating',
    ratingData
  )
  .subscribe({

    next: (response) => {

      console.log(
        'Rating submitted:',
        response
      );


      // Mark this order as rated

      this.ratedOrderIds.add(
        Number(
          this.selectedOrder.purchaseOrderId
        )
      );


      this.ratingSubmitting = false;

      this.closeRatingModal();


      alert(
        'Thank you! Your rating has been submitted successfully.'
      );

    },


    error: (error) => {

      console.error(
        'Failed to submit rating:',
        error
      );


      this.ratingSubmitting = false;


      alert(
        error.error?.message ||
        'Failed to submit rating. Please try again.'
      );

    }

  });

}

getMyRatings(): void {

  if (!this.userId) {

    return;

  }


  this.http.get<any[]>(
    `http://localhost:8080/rating/user/${this.userId}`
  )
  .subscribe({

    next: (ratings) => {

      console.log(
        'My Ratings:',
        ratings
      );


      ratings.forEach(rating => {

        const orderId =
          rating.purchaseOrder?.purchaseOrderId;

        if (orderId) {

          this.ratedOrderIds.add(
            Number(orderId)
          );

        }

      });

    },

    error: (error) => {

      console.error(
        'Failed to fetch ratings:',
        error
      );

    }

  });

}

}