import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-supplier-add-product',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './supplier-add-product.html',
  styleUrl: './supplier-add-product.scss'
})
export class SupplierAddProduct implements OnInit {

  productForm!: FormGroup;

  categories: any[] = [];
  departments: any[] = [];

  supplierId!: number;

  saving = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {

    this.loadCategories();
    this.loadDepartments();

    // GET LOGGED-IN SUPPLIER ID

    const storedSupplierId =
      localStorage.getItem('supplierId');


    if (!storedSupplierId) {

      this.showMessage(
        'Supplier information not found. Please login again.',
        'error'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.supplierId =
      Number(storedSupplierId);


    // =====================================================
    // INITIALIZE FORM
    // =====================================================

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
      departmentId: [
        '',
        Validators.required
      ],

      status: [
        'ACTIVE',
        Validators.required
      ]

    });
    this.loadCategories();

  }


  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

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

  // LOAD DEPARTMENT 
  loadDepartments(): void {

  this.http.get<any[]>(
    'http://localhost:8080/departments'
  )
  .subscribe({

    next: (response) => {

      console.log(
        'Departments:',
        response
      );

      this.departments = response;

    },

    error: (error) => {

      console.error(
        'Failed to load departments:',
        error
      );

      this.showMessage(
        'Failed to load departments.',
        'error'
      );

    }

  });

}


  // =========================================================
  // ADD PRODUCT
  // =========================================================

  addProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      this.showMessage(
        'Please fill all required fields correctly.',
        'error'
      );

      return;

    }


    if (!this.supplierId) {

      this.showMessage(
        'Supplier information not found.',
        'error'
      );

      return;

    }


    this.saving = true;


    const formValue =
      this.productForm.value;

    const productData = {

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
      department: {
        departmentId:
        Number(formValue.departmentId)
      },

      supplier: {

        supplierId:
          this.supplierId

      }

    };


    console.log(
      'Adding Supplier Product:',
      productData
    );


    // =====================================================
    // API CALL
    // =====================================================

    this.http.post(
      'http://localhost:8080/products',
      productData
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Product added:',
          response
        );


        this.saving = false;


        this.showMessage(
          'Product added successfully!',
          'success'
        );


        setTimeout(() => {

          this.router.navigate([
            '/supplier/products'
          ]);

        }, 1000);

      },


      error: (error) => {

        console.error(
          'Failed to add product:',
          error
        );


        this.saving = false;


        this.showMessage(

          error.error?.message ||

          'Failed to add product.',

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
      '/supplier/products'
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