import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-admin-suppliers',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    NgClass,

    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],

  templateUrl: './admin-suppliers.html',
  styleUrl: './admin-suppliers.scss'
})
export class AdminSuppliers implements OnInit {


  suppliers: any[] = [];
  filteredSuppliers: any[] = [];
  loading = false;
  searchText = '';
  selectedStatus = 'ALL';
  showSupplierDetails = false;
  selectedSupplier: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.getSuppliers();

  }

  // GET ALL SUPPLIERS

  getSuppliers(): void {

    this.loading = true;

    this.http
      .get<any[]>(
        'http://localhost:8080/suppliers'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Suppliers received:',
            response
          );

          this.suppliers = response || [];

          this.filteredSuppliers =
            [...this.suppliers];

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to fetch suppliers:',
            error
          );

          this.loading = false;

          this.snackBar.open(
            error.error?.message ||
            'Failed to load suppliers.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar']
            }
          );

        }

      });

  }

  // FILTER SUPPLIERS

  filterSuppliers(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredSuppliers =
      this.suppliers.filter(
        supplier => {

          const name =
            supplier.name
              ?.toLowerCase() || '';

          const email =
            supplier.email
              ?.toLowerCase() || '';

          const phone =
            supplier.phone
              ?.toLowerCase() || '';

          const address =
            supplier.address
              ?.toLowerCase() || '';

          const gst =
            supplier.gstNumber
              ?.toLowerCase() || '';

          const account =
            supplier.accountNo
              ?.toLowerCase() || '';

          const status =
            supplier.status
              ?.toLowerCase() || '';


          const matchesSearch =

            name.includes(search) ||

            email.includes(search) ||

            phone.includes(search) ||

            address.includes(search) ||

            gst.includes(search) ||

            account.includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            supplier.status ===
            this.selectedStatus;


          return (

            matchesSearch &&
            matchesStatus

          );

        }
      );

  }

  // CLEAR FILTERS

  clearFilters(): void {

    this.searchText = '';

    this.selectedStatus = 'ALL';

    this.filteredSuppliers =
      [...this.suppliers];

  }

  // SUMMARY COUNTS

  getTotalSuppliersCount(): number {

    return this.suppliers.length;

  }


  getActiveSuppliersCount(): number {

    return this.suppliers.filter(
      supplier =>
        supplier.status?.toUpperCase() ===
        'ACTIVE'
    ).length;

  }


  getInactiveSuppliersCount(): number {

    return this.suppliers.filter(
      supplier =>
        supplier.status?.toUpperCase() ===
        'INACTIVE'
    ).length;

  }


  getAverageRating(): number {

    const ratedSuppliers =
      this.suppliers.filter(
        supplier =>
          supplier.rating != null &&
          supplier.rating > 0
      );


    if (ratedSuppliers.length === 0) {

      return 0;

    }


    const total =
      ratedSuppliers.reduce(
        (
          sum,
          supplier
        ) =>
          sum +
          Number(supplier.rating),
        0
      );


    return total /
      ratedSuppliers.length;

  }

  // STATUS CLASS

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'ACTIVE':
        return 'status-active';

      case 'INACTIVE':
        return 'status-inactive';

      default:
        return 'status-default';

    }

  }

  // RATING CLASS

  getRatingClass(
    rating: number
  ): string {

    if (!rating) {

      return 'rating-none';

    }

    if (rating >= 4) {

      return 'rating-good';

    }

    if (rating >= 3) {

      return 'rating-average';

    }

    return 'rating-low';

  }

  // RATING STARS

  getRatingStars(
    rating: number
  ): string {

    if (!rating) {

      return '☆☆☆☆☆';

    }

    const rounded =
      Math.round(Number(rating));

    return '★'.repeat(rounded) +
           '☆'.repeat(5 - rounded);

  }

  // ADD SUPPLIER

  addSupplier(): void {

    this.router.navigate([
    '/admin/add-supplier'
  ]);

  }

  // VIEW SUPPLIER

  viewSupplier(
    supplier: any
  ): void {

    this.selectedSupplier =
      supplier;

    this.showSupplierDetails =
      true;

  }

  // CLOSE DETAILS

  closeSupplierDetails(): void {

    this.showSupplierDetails =
      false;

    this.selectedSupplier =
      null;

  }

  // EDIT SUPPLIER

  editSupplier(
    supplierId: number
  ): void {

    console.log(
      'Editing Admin Supplier ID:',
      supplierId
    );


    if (!supplierId) {

      console.error(
        'Supplier ID is missing:',
        supplierId
      );

      return;

    }


    this.closeSupplierDetails();


    this.router.navigate([
    '/admin/edit-supplier',
    supplierId
  ]);

  }


  // DELETE SUPPLIER

  deleteSupplier(
    supplier: any
  ): void {

    if (!supplier?.supplierId) {

      return;

    }


    const dialogRef =
      this.dialog.open(
        ConfirmDialog,
        {
          width: '420px',

          data: {

            title:
              'Delete Supplier',

            message:
              `Are you sure you want to delete supplier "${supplier.name}"?`,

            icon:
              'delete_forever'

          }

        }
      );


    dialogRef.afterClosed()
      .subscribe(
        confirmed => {

          if (!confirmed) {

            return;

          }


          this.performDeleteSupplier(
            supplier.supplierId
          );

        }
      );

  }

  // PERFORM DELETE

  private performDeleteSupplier(
    supplierId: number
  ): void {

    this.http
      .delete(
        `http://localhost:8080/suppliers/${supplierId}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Supplier deleted:',
            response
          );


          this.snackBar.open(
            'Supplier deleted successfully.',
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );


          this.getSuppliers();

        },

        error: (error) => {

          console.error(
            'Failed to delete supplier:',
            error
          );


          this.snackBar.open(
            error.error?.message ||
            'Failed to delete supplier.',
            'Close',
            {
              duration: 4000,
              panelClass: ['error-snackbar']
            }
          );

        }

      });

  }
  // SUPPLIER INITIAL

  getSupplierInitial(
    name: string
  ): string {

    if (!name) {

      return 'S';

    }


    return name
      .charAt(0)
      .toUpperCase();

  }

}