import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

@Component({
  selector: 'app-my-ratings',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe
  ],

  templateUrl: './my-ratings.html',
  styleUrl: './my-ratings.scss'
})
export class MyRatings implements OnInit {

  // USER

  userId: number | null = null;

  // RATINGS

  ratings: any[] = [];

  filteredRatings: any[] = [];

  // LOADING

  loading = false;

  // FILTERS

  searchText = '';

  selectedRating = 'ALL';


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

    this.getMyRatings();

  }

  // GET MY RATINGS

  getMyRatings(): void {

    if (!this.userId) {

      console.error(
        'User ID not found.'
      );

      return;

    }

    this.loading = true;

    this.http.get<any[]>(
      `http://localhost:8080/rating/user/${this.userId}`
    )
    .subscribe({

      next: (response) => {

        console.log(
          'My Ratings:',
          response
        );

        this.ratings = response || [];

        this.filteredRatings =
          this.ratings;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to fetch ratings:',
          error
        );

        this.loading = false;

      }

    });

  }

  // FILTER RATINGS

  filterRatings(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredRatings =
      this.ratings.filter(rating => {

        const productName =
          rating.productName
            ?.toLowerCase()
            || '';


        const remark =
          rating.remark
            ?.toLowerCase()
            || '';


        const orderId =
          rating.purchaseOrder?.purchaseOrderId
            ?.toString()
            .toLowerCase()
            || '';


        const matchesSearch =

          productName.includes(search) ||

          remark.includes(search) ||

          orderId.includes(search);


        const matchesRating =

          this.selectedRating === 'ALL' ||

          rating.rating?.toString() ===
          this.selectedRating;


        return (
          matchesSearch &&
          matchesRating
        );

      });

  }

  // SUMMARY

  getAverageRating(): number {

    if (!this.ratings.length) {

      return 0;

    }

    const total =
      this.ratings.reduce(
        (sum, rating) =>
          sum + (rating.rating || 0),
        0
      );

    return total / this.ratings.length;

  }


  getFiveStarCount(): number {

    return this.ratings.filter(
      rating =>
        rating.rating === 5
    ).length;

  }


  getFourStarCount(): number {

    return this.ratings.filter(
      rating =>
        rating.rating === 4
    ).length;

  }


  getThreeStarCount(): number {

    return this.ratings.filter(
      rating =>
        rating.rating === 3
    ).length;

  }


  getTwoStarCount(): number {

    return this.ratings.filter(
      rating =>
        rating.rating === 2
    ).length;

  }


  getOneStarCount(): number {

    return this.ratings.filter(
      rating =>
        rating.rating === 1
    ).length;

  }

  // STAR WIDTH
  getRatingPercentage(
    ratingValue: number
  ): number {

    if (!this.ratings.length) {

      return 0;

    }

    const count =
      this.ratings.filter(
        rating =>
          rating.rating === ratingValue
      ).length;

    return (
      count /
      this.ratings.length
    ) * 100;

  }

  // STAR ARRAY

  getStars(
    ratingValue: number
  ): number[] {

    return Array(5)
      .fill(0)
      .map(
        (_, index) =>
          index < ratingValue ? 1 : 0
      );

  }

  // STAR DISPLAY

  getRatingStars(
    ratingValue: number
  ): string {

    return '★'.repeat(
      ratingValue || 0
    ) +
    '☆'.repeat(
      5 - (ratingValue || 0)
    );

  }

  // RATING LABEL

  getRatingLabel(
    ratingValue: number
  ): string {

    switch (ratingValue) {

      case 5:
        return 'Excellent';

      case 4:
        return 'Very Good';

      case 3:
        return 'Good';

      case 2:
        return 'Needs Improvement';

      case 1:
        return 'Poor';

      default:
        return 'Not Rated';

    }

  }

}