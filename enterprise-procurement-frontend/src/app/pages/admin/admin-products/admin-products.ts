import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../confirm-dialog/confirm-dialog';



@Component({

  selector: 'app-admin-products',

  standalone: true,

  imports: [
    DatePipe,
    CommonModule,
    DecimalPipe,
    NgClass,
    FormsModule,
    MatIconModule
  ],

  templateUrl: './admin-products.html',

  styleUrl: './admin-products.scss'

})
export class AdminProducts implements OnInit {


  // PRODUCTS

  products: any[] = [];

  filteredProducts: any[] = [];
  loading = false;
  searchText = '';
  selectedCategory = 'ALL';
  selectedSupplier = 'ALL';
  categories: string[] = [];
  suppliers: string[] = [];
  showProductDetails = false;
  selectedProduct: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {}

  // INIT

  ngOnInit(): void {

    this.getProducts();

  }

  // GET PRODUCTS

  getProducts(): void {

    this.loading = true;


    this.http.get<any[]>(

      'http://localhost:8080/products'

    )
    .subscribe({

      next: (response) => {

        console.log(
          'Admin Products:',
          response
        );


        this.products = response || [];


        this.buildFilters();


        this.filterProducts();


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Failed to fetch products:',
          error
        );


        this.loading = false;


        this.snackBar.open(

          'Failed to load products.',

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

  // BUILD FILTER OPTIONS
  // =========================================

  buildFilters(): void {

    this.categories = [

      ...new Set(

        this.products

          .map(
            product =>
              product.category?.categoryName
          )

          .filter(
            category => !!category
          )

      )

    ];


    this.suppliers = [

      ...new Set(

        this.products

          .map(
            product =>
              product.supplier?.name
          )

          .filter(
            supplier => !!supplier
          )

      )

    ];

  }


  // =========================================
  // FILTER PRODUCTS
  // =========================================

  filterProducts(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredProducts =
      this.products.filter(product => {


        const productName =
          product.name
            ?.toLowerCase()
            || '';


        const description =
          product.description
            ?.toLowerCase()
            || '';


        const category =
          product.category?.categoryName
            ?.toLowerCase()
            || '';


        const supplier =
          product.supplier?.name
            ?.toLowerCase()
            || '';


        const matchesSearch =

          !search ||

          productName.includes(search) ||

          description.includes(search) ||

          category.includes(search) ||

          supplier.includes(search);


        const matchesCategory =

          this.selectedCategory === 'ALL' ||

          product.category?.categoryName ===
          this.selectedCategory;


        const matchesSupplier =

          this.selectedSupplier === 'ALL' ||

          product.supplier?.name ===
          this.selectedSupplier;


        return (

          matchesSearch &&

          matchesCategory &&

          matchesSupplier

        );

      });

  }


  // =========================================
  // CLEAR FILTERS
  // =========================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory = 'ALL';

    this.selectedSupplier = 'ALL';

    this.filterProducts();

  }


  // =========================================
  // STOCK STATUS
  // =========================================

  getStockStatus(
    quantity: number
  ): string {

    if (quantity === 0) {

      return 'Out of Stock';

    }


    if (quantity <= 10) {

      return 'Low Stock';

    }


    return 'In Stock';

  }


  // =========================================
  // STOCK CLASS
  // =========================================

  getStockClass(
    quantity: number
  ): string {

    if (quantity === 0) {

      return 'out-stock';

    }


    if (quantity <= 10) {

      return 'low-stock';

    }


    return 'in-stock';

  }


  // =========================================
  // PRODUCT STATUS CLASS
  // =========================================

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


  // =========================================
  // SUMMARY
  // =========================================

  getTotalProductsCount(): number {

    return this.products.length;

  }


  getActiveProductsCount(): number {

    return this.products.filter(

      product =>
        product.status === 'ACTIVE'

    ).length;

  }


  getOutOfStockCount(): number {

    return this.products.filter(

      product =>
        product.numberOfQuantities === 0

    ).length;

  }


  getLowStockCount(): number {

    return this.products.filter(

      product =>

        product.numberOfQuantities > 0 &&

        product.numberOfQuantities <= 10

    ).length;

  }


  // =========================================
  // VIEW PRODUCT
  // =========================================

  viewProduct(product: any): void {

    this.selectedProduct = product;

    this.showProductDetails = true;

  }


  // CLOSE DETAILS

  closeProductDetails(): void {

    this.showProductDetails = false;

    this.selectedProduct = null;

  }


  // ADD PRODUCT

  addProduct(): void {

    this.router.navigate([
      '/add-product'
    ]);

  }

  // EDIT PRODUCT

  editProduct(productId: number): void {

  if (!productId) {

    console.error(
      'Product ID is missing:',
      productId
    );

    return;

  }

  console.log(
    'Editing Admin Product ID:',
    productId
  );

  this.router.navigate([
    '/admin/edit-product',
    productId
  ]);

}

  // DELETE PRODUCT

  deleteProduct(
    product: any
  ): void {

    const dialogRef =
      this.dialog.open(

        ConfirmDialog,

        {

          width: '420px',

          data: {

            title:
              'Delete Product',

            message:
              `Do you want to delete "${product.name}"?`,

            icon:
              'delete',

            confirmText:
              'Delete',

            cancelText:
              'Cancel'

          }

        }

      );


    dialogRef
      .afterClosed()
      .subscribe(

        (confirmed) => {

          if (!confirmed) {

            return;

          }


          this.http.delete(

            `http://localhost:8080/products/${product.productId}`,

            {
              responseType: 'text'
            }

          )
          .subscribe({

            next: (response) => {

              console.log(response);


              /*
               * Remove product locally
               */

              this.products =
                this.products.filter(

                  item =>
                    item.productId !==
                    product.productId

                );


              this.buildFilters();

              this.filterProducts();


              /*
               * Close details modal
               */

              if (

                this.selectedProduct?.productId ===
                product.productId

              ) {

                this.closeProductDetails();

              }


              /*
               * Success message
               */

              this.snackBar.open(

                'Product deleted successfully!',

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

                'Failed to delete product:',

                error

              );


              this.snackBar.open(

                error.error?.message ||

                'Failed to delete product.',

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