import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-edit-product.html',
  styleUrl: './admin-edit-product.scss'
})
export class AdminEditProduct implements OnInit {

  productId!: number;

  productForm!: FormGroup;

  categories: any[] = [];
  suppliers: any[] = [];

  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.productForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      description: [
        ''
      ],

      pricePerProduct: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      numberOfQuantities: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      categoryId: [
        '',
        Validators.required
      ],

      supplierId: [
        '',
        Validators.required
      ],

      status: [
        'ACTIVE',
        Validators.required
      ]

    });


    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.showMessage(
        'Product ID not found.',
        'error'
      );

      this.router.navigate([
        '/admin/products'
      ]);

      return;
    }


    this.productId = Number(id);


    this.loadCategories();

    this.loadSuppliers();

    this.loadProduct();

  }

  // LOAD PRODUCT

  loadProduct(): void {

    this.loading = true;

    this.http.get<any>(
      `http://localhost:8080/products/${this.productId}`
    )
    .subscribe({

      next: (product) => {

        console.log(
          'Product received:',
          product
        );


        this.productForm.patchValue({

          name:
            product.name || '',

          description:
            product.description || '',

          pricePerProduct:
            product.pricePerProduct || 0,

          numberOfQuantities:
            product.numberOfQuantities || 0,

          categoryId:
            product.category?.categoryId || '',

          supplierId:
            product.supplier?.supplierId || '',

          status:
            product.status || 'ACTIVE'

        });


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Failed to load product:',
          error
        );

        this.loading = false;

        this.showMessage(
          'Failed to load product.',
          'error'
        );

        this.router.navigate([
          '/admin/products'
        ]);

      }

    });

  }

  // LOAD CATEGORIES

  loadCategories(): void {

    this.http.get<any[]>(
      'http://localhost:8080/categories'
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Categories:',
          response
        );

        this.categories = response;

      },

      error: (error) => {

        console.error(
          'Failed to load categories:',
          error
        );

        this.showMessage(
          'Failed to load categories.',
          'error'
        );

      }

    });

  }


  // =========================================================
  // LOAD SUPPLIERS
  // =========================================================

  loadSuppliers(): void {

    this.http.get<any[]>(
      'http://localhost:8080/suppliers'
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Suppliers:',
          response
        );

        this.suppliers = response;

      },

      error: (error) => {

        console.error(
          'Failed to load suppliers:',
          error
        );

        this.showMessage(
          'Failed to load suppliers.',
          'error'
        );

      }

    });

  }


  // =========================================================
  // UPDATE PRODUCT
  // =========================================================

  updateProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      this.showMessage(
        'Please fill all required fields correctly.',
        'error'
      );

      return;

    }


    this.saving = true;


    const formValue =
      this.productForm.value;


    const productData = {

      productId:
        this.productId,

      name:
        formValue.name,

      description:
        formValue.description,

      pricePerProduct:
        Number(formValue.pricePerProduct),

      numberOfQuantities:
        Number(formValue.numberOfQuantities),

      status:
        formValue.status,

      category: {

        categoryId:
          Number(formValue.categoryId)

      },

      supplier: {

        supplierId:
          Number(formValue.supplierId)

      }

    };


    console.log(
      'Updating Product:',
      productData
    );


    this.http.put(
      `http://localhost:8080/products/${this.productId}`,
      productData
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Product updated:',
          response
        );


        this.saving = false;


        this.showMessage(
          'Product updated successfully!',
          'success'
        );


        setTimeout(() => {

          this.router.navigate([
            '/admin/products'
          ]);

        }, 1000);

      },


      error: (error) => {

        console.error(
          'Failed to update product:',
          error
        );


        this.saving = false;


        this.showMessage(

          error.error?.message ||

          'Failed to update product.',

          'error'

        );

      }

    });

  }


  // =========================================================
  // CANCEL
  // =========================================================

  cancel(): void {

    this.router.navigate([
      '/admin/products'
    ]);

  }


  // =========================================================
  // FORM HELPERS
  // =========================================================

  isFieldInvalid(
    fieldName: string
  ): boolean {

    const field =
      this.productForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched)
    );

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
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass:
          type === 'success'
            ? ['success-snackbar']
            : ['error-snackbar']
      }
    );

  }

}