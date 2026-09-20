
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-supplier-edit-product',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './supplier-edit-product.html',
  styleUrl: './supplier-edit-product.scss'
})
export class SupplierEditProduct implements OnInit {

  productId!: number;

  supplierId!: number;

  productForm!: FormGroup;

  categories: any[] = [];

  departments: any[] = [];

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

    // ==========================================
    // GET SUPPLIER ID
    // ==========================================

    this.supplierId = Number(
      localStorage.getItem('supplierId')
    );


    if (!this.supplierId) {

      this.showMessage(
        'Supplier information not found. Please login again.',
        'error'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    // ==========================================
    // CREATE FORM
    // ==========================================

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

      departmentId: [
        '',
        Validators.required
      ],

      categoryId: [
        '',
        Validators.required
      ],

      status: [
        'ACTIVE',
        Validators.required
      ]

    });


    // ==========================================
    // GET PRODUCT ID
    // ==========================================

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.showMessage(
        'Product ID not found.',
        'error'
      );

      this.router.navigate([
        '/supplier/products'
      ]);

      return;
    }


    this.productId = Number(id);


    // ==========================================
    // LOAD DATA
    // ==========================================

    this.loadDepartments();

    this.loadCategories();

    this.loadProduct();

  }


  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  loadProduct(): void {

    this.loading = true;


    this.http.get<any>(
      `http://localhost:8080/products/${this.productId}`
    )
    .subscribe({

      next: (product) => {

        console.log(
          'Supplier Product received:',
          product
        );


        // ==========================================
        // SECURITY CHECK
        // ==========================================

        const productSupplierId =
          Number(
            product.supplier?.supplierId
          );


        if (
          productSupplierId !== this.supplierId
        ) {

          this.loading = false;


          this.showMessage(
            'You are not allowed to edit this product.',
            'error'
          );


          this.router.navigate([
            '/supplier/products'
          ]);


          return;

        }


        // ==========================================
        // PATCH FORM
        // ==========================================

        this.productForm.patchValue({

          name:
            product.name || '',

          description:
            product.description || '',

          pricePerProduct:
            product.pricePerProduct || 0,

          numberOfQuantities:
            product.numberOfQuantities || 0,

          departmentId:
            product.department?.departmentId || '',

          categoryId:
            product.category?.categoryId || '',

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
          '/supplier/products'
        ]);

      }

    });

  }


  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================

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


    // ==========================================
    // PRODUCT DATA
    // ==========================================

    const productData = {

      productId:
        this.productId,

      name:
        formValue.name,

      description:
        formValue.description,

      pricePerProduct:
        Number(
          formValue.pricePerProduct
        ),

      numberOfQuantities:
        Number(
          formValue.numberOfQuantities
        ),

      status:
        formValue.status,

      supplier: {

        supplierId:
          this.supplierId

      },

      department: {

        departmentId:
          Number(
            formValue.departmentId
          )

      },

      category: {

        categoryId:
          Number(
            formValue.categoryId
          )

      }

    };


    console.log(
      'Updating Supplier Product:',
      productData
    );


    // ==========================================
    // PUT REQUEST
    // ==========================================

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
            '/supplier/products'
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
      (
        field.dirty ||
        field.touched
      )
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

