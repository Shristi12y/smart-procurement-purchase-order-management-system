import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

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
  selector: 'app-rating',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './rating.html',
  styleUrl: './rating.scss'
})


export class Rating implements OnInit, AfterViewInit, OnDestroy {

  // =========================================================
  // DATA
  // =========================================================

  ratings: any[] = [];

  filteredRatings: any[] = [];

  loading = false;


  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  searchText = '';

  selectedRating = 'ALL';


  // =========================================================
  // SUMMARY
  // =========================================================

  averageRating = 0;

  totalRatings = 0;

  fiveStarRatings = 0;

  lowRatings = 0;


  // =========================================================
  // RATING DISTRIBUTION
  // =========================================================

  ratingDistribution: number[] = [
    0,
    0,
    0,
    0,
    0
  ];


  ratingLabels: string[] = [
    '1 Star',
    '2 Stars',
    '3 Stars',
    '4 Stars',
    '5 Stars'
  ];


  ratingChart: Chart | undefined;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.getRatings();

  }


  ngAfterViewInit(): void {

    // Chart is created after API data arrives

  }


  ngOnDestroy(): void {

    if (this.ratingChart) {

      this.ratingChart.destroy();

    }

  }


  // =========================================================
  // GET ALL RATINGS
  // =========================================================

  getRatings(): void {

    this.loading = true;

    this.http.get<any[]>(
      'http://localhost:8080/rating'
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Ratings:',
          response
        );

        this.ratings =
          response || [];

        this.filteredRatings =
          [
            ...this.ratings
          ];


        // Calculate summary

        this.calculateSummary();


        // Calculate distribution

        this.calculateRatingDistribution();


        this.loading = false;


        // Create chart after HTML renders

        setTimeout(() => {

          this.createRatingChart();

        }, 100);

      },


      error: (error) => {

        console.error(
          'Failed to load ratings:',
          error
        );

        this.loading = false;

        this.showMessage(
          'Failed to load ratings.',
          'error'
        );

      }

    });

  }


  // =========================================================
  // SUMMARY
  // =========================================================

  calculateSummary(): void {

    this.totalRatings =
      this.ratings.length;


    if (this.totalRatings === 0) {

      this.averageRating = 0;

      this.fiveStarRatings = 0;

      this.lowRatings = 0;

      return;

    }


    const total =
      this.ratings.reduce(
        (
          sum,
          rating
        ) => {

          return (
            sum +
            Number(
              rating.rating || 0
            )
          );

        },
        0
      );


    this.averageRating =
      total /
      this.totalRatings;


    this.fiveStarRatings =
      this.ratings.filter(
        rating =>
          Number(
            rating.rating
          ) === 5
      ).length;


    this.lowRatings =
      this.ratings.filter(
        rating =>
          Number(
            rating.rating
          ) <= 2
      ).length;

  }


  // =========================================================
  // RATING DISTRIBUTION
  // =========================================================

  calculateRatingDistribution(): void {

    this.ratingDistribution = [
      0,
      0,
      0,
      0,
      0
    ];


    this.ratings.forEach(
      rating => {

        const value =
          Number(
            rating.rating
          );


        if (
          value >= 1 &&
          value <= 5
        ) {

          this.ratingDistribution[
            value - 1
          ]++;

        }

      }
    );


    console.log(
      'Rating Distribution:',
      this.ratingDistribution
    );

  }


  // =========================================================
  // CREATE CHART
  // =========================================================

  createRatingChart(): void {

    const canvas =
      document.getElementById(
        'ratingDistributionChart'
      ) as HTMLCanvasElement;


    if (!canvas) {

      return;

    }


    if (this.ratingChart) {

      this.ratingChart.destroy();

    }


    this.ratingChart =
      new Chart(
        canvas,
        {

          type: 'bar',


          data: {

            labels:
              this.ratingLabels,


            datasets: [

              {

                label:
                  'Number of Ratings',

                data:
                  this.ratingDistribution,


                backgroundColor:
                  '#4f46e5',

                borderColor:
                  '#4f46e5',

                borderWidth: 1,

                borderRadius: 7,

                barPercentage: 0.55,

                categoryPercentage: 0.65

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

                  label: (
                    context
                  ) => {

                    const value =
                      Number(
                        context.raw || 0
                      );


                    return (
                      ' Ratings: ' +
                      value
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


                ticks: {

                  precision: 0,

                  stepSize: 1

                },


                grid: {

                  display: true

                }

              }

            }

          }

        }

      );

  }


  // =========================================================
  // SEARCH
  // =========================================================

  onSearch(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredRatings =
      this.ratings.filter(
        rating => {

          const ratingId =
            rating.ratingId
              ?.toString()
              .toLowerCase() || '';


          const productName =
            rating.productName
              ?.toLowerCase() || '';


          const userName =
            rating.userName
              ?.toLowerCase() || '';


          const poId =
            rating.purchaseOrder
              ?.purchaseOrderId
              ?.toString()
              .toLowerCase() || '';


          const remark =
            rating.remark
              ?.toLowerCase() || '';


          return (

            ratingId.includes(search) ||

            productName.includes(search) ||

            userName.includes(search) ||

            poId.includes(search) ||

            remark.includes(search)

          );

        }
      );


    this.applyRatingFilter();

  }


  // =========================================================
  // RATING FILTER
  // =========================================================

  onRatingChange(): void {

    this.onSearch();

  }


  applyRatingFilter(): void {

    if (
      this.selectedRating === 'ALL'
    ) {

      return;

    }


    const selected =
      Number(
        this.selectedRating
      );


    this.filteredRatings =
      this.filteredRatings.filter(
        rating =>
          Number(
            rating.rating
          ) === selected
      );

  }


  // =========================================================
  // STAR DISPLAY
  // =========================================================

  getStars(
    rating: number
  ): string {

    const value =
      Number(rating || 0);


    return '★'.repeat(value) +
           '☆'.repeat(5 - value);

  }


  // =========================================================
  // RATING CLASS
  // =========================================================

  getRatingClass(
    rating: number
  ): string {

    const value =
      Number(rating || 0);


    if (value >= 4) {

      return 'rating-high';

    }


    if (value === 3) {

      return 'rating-medium';

    }


    return 'rating-low';

  }


  // =========================================================
  // DATE FORMAT
  // =========================================================

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


  // =========================================================
  // RATING FORMAT
  // =========================================================

  formatRating(
    rating: number
  ): string {

    return Number(
      rating || 0
    ).toFixed(1);

  }


  // =========================================================
  // SNACKBAR
  // =========================================================

  showMessage(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.snackBar.open(
      message,
      'Close',
      {

        duration: 3000,

        horizontalPosition:
          'right',

        verticalPosition:
          'top',

        panelClass:
          type === 'success'
            ? ['success-snackbar']
            : ['error-snackbar']

      }
    );

  }

}