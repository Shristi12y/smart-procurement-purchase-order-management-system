
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './supplier-profile.html',
  styleUrl: './supplier-profile.scss'
})
export class SupplierProfile implements OnInit {

  supplier: any = null;
  supplierAverageRating = 0;
  supplierRatingCount = 0;
  loading = false;
  editing = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.loadProfile();
    this.loadSupplierAverageRating();

  }


  /*  LOAD SUPPLIER PROFILE*/

  loadProfile(): void {

    const supplierId =
      localStorage.getItem('supplierId');

    if (!supplierId) {

      this.showMessage(
        'Supplier information not found.',
        'error'
      );

      return;
    }

    this.loading = true;

    this.http.get<any>(
      `http://localhost:8080/suppliers/${supplierId}`
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Supplier Profile:',
          response
        );

        this.supplier = response;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load supplier profile:',
          error
        );

        this.loading = false;

        this.showMessage(
          'Failed to load profile.',
          'error'
        );

      }

    });

  }


  /* =========================================================
     EDIT PROFILE
  ========================================================= */

  editProfile(): void {

    this.editing = true;

  }


  /*  CANCEL EDIT */

  cancelEdit(): void {

    this.editing = false;

    this.loadProfile();

  }


  /*  UPDATE PROFILE */

  updateProfile(): void {

    if (!this.supplier) {
      return;
    }

    const supplierId =
      this.supplier.supplierId;

    this.http.put<any>(
      `http://localhost:8080/suppliers/${supplierId}`,
      this.supplier
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Profile Updated:',
          response
        );

        this.supplier = response;

        this.editing = false;

        localStorage.setItem(
          'name',
          response.name
        );

        this.showMessage(
          'Profile updated successfully.',
          'success'
        );

      },

      error: (error) => {

        console.error(
          'Profile update failed:',
          error
        );

        this.showMessage(
          error.error?.message ||
          'Failed to update profile.',
          'error'
        );

      }

    });

  }


  /* =========================================================
     RATING
  ========================================================= */

  getRatingStars(): number[] {

    const rating =
      Number(this.supplier?.rating || 0);

    return Array(5)
      .fill(0)
      .map((_, index) =>
        index < rating ? 1 : 0
      );

  }


  /* =========================================================
     STATUS CLASS
  ========================================================= */

  getStatusClass(): string {

    return String(
      this.supplier?.status || ''
    ).toUpperCase() === 'ACTIVE'
      ? 'status-active'
      : 'status-inactive';

  }


  /* =========================================================
     FORMAT ACCOUNT NUMBER
  ========================================================= */

  formatAccountNumber(
    accountNo: string
  ): string {

    if (!accountNo) {
      return 'N/A';
    }

    return accountNo;

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

  loadSupplierAverageRating(): void {

  const supplierId =
    localStorage.getItem('supplierId');

  if (!supplierId) {

    console.error(
      'Supplier ID not found in localStorage'
    );

    return;
  }


  this.http.get<number>(
    `http://localhost:8080/rating/supplier/${supplierId}/average`
  )
  .subscribe({

    next: (averageRating) => {

      console.log(
        'Supplier Average Rating:',
        averageRating
      );

      this.supplierAverageRating =
        averageRating || 0;

    },

    error: (error) => {

      console.error(
        'Failed to load supplier average rating:',
        error
      );

      this.supplierAverageRating = 0;

    }

  });

}

}
