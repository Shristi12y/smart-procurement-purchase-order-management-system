import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

interface Department {

  departmentId: number;
  departmentName: string;
  manager: string;

}


interface Category {

  categoryId?: number;
  categoryName: string;

  department?: Department;

}


@Component({
  selector: 'app-admin-edit-category',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-edit-category.html',
  styleUrl: './admin-edit-category.scss'
})
export class AdminEditCategory
  implements OnInit {


  private categoryApi =
    'http://localhost:8080/categories';

  private departmentApi =
    'http://localhost:8080/departments';


  categoryId!: number;

  departments: Department[] = [];

  loading = false;

  loadingCategory = true;

  loadingDepartments = true;


  category = {

    categoryId: 0,

    categoryName: '',

    departmentId: null as number | null

  };


  constructor(

    private http: HttpClient,

    private route: ActivatedRoute,

    private router: Router,

    private snackBar: MatSnackBar

  ) {}


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.showMessage(
        'Invalid category ID.'
      );

      this.router.navigate([
        '/admin/categories'
      ]);

      return;

    }


    this.categoryId = Number(id);


    this.loadDepartments();

    this.loadCategory();

  }


  // =========================================
  // LOAD DEPARTMENTS
  // =========================================

  loadDepartments(): void {

    this.loadingDepartments = true;


    this.http
      .get<Department[]>(this.departmentApi)
      .subscribe({

        next: (response) => {

          this.departments =
            response || [];

          this.loadingDepartments = false;

        },

        error: (error) => {

          console.error(
            'Failed to load departments:',
            error
          );

          this.loadingDepartments = false;

          this.showMessage(
            'Failed to load departments.'
          );

        }

      });

  }


  // =========================================
  // LOAD CATEGORY
  // =========================================

  loadCategory(): void {

    this.loadingCategory = true;


    this.http
      .get<Category[]>(this.categoryApi)
      .subscribe({

        next: (categories) => {

          const foundCategory =
            categories.find(
              category =>
                Number(category.categoryId) ===
                this.categoryId
            );


          if (!foundCategory) {

            this.showMessage(
              'Category not found.'
            );

            this.router.navigate([
              '/admin/categories'
            ]);

            return;

          }


          this.category = {

            categoryId:
              foundCategory.categoryId || 0,

            categoryName:
              foundCategory.categoryName || '',

            departmentId:
              foundCategory.department?.departmentId
              ?? null

          };


          console.log(
            'Editing category:',
            this.category
          );


          this.loadingCategory = false;

        },


        error: (error) => {

          console.error(
            'Failed to load category:',
            error
          );

          this.loadingCategory = false;

          this.showMessage(
            'Failed to load category.'
          );

          this.router.navigate([
            '/admin/categories'
          ]);

        }

      });

  }


  // =========================================
  // UPDATE CATEGORY
  // =========================================

  updateCategory(): void {

    if (!this.isFormValid()) {

      this.showMessage(
        'Please enter category name and select a department.'
      );

      return;

    }


    this.loading = true;


    const categoryPayload = {

      categoryId:
        this.category.categoryId,

      categoryName:
        this.category.categoryName.trim(),

      department: {

        departmentId:
          this.category.departmentId

      }

    };


    console.log(
      'Updating category:',
      categoryPayload
    );


    /*
     * IMPORTANT:
     *
     * Your current CategoryController does not
     * have PUT /categories/{id}.
     *
     * Therefore this page expects the backend
     * update endpoint to be added.
     */

    this.http
      .put(
        `${this.categoryApi}/${this.categoryId}`,
        categoryPayload
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Category updated:',
            response
          );

          this.loading = false;

          this.showMessage(
            'Category updated successfully.'
          );


          setTimeout(() => {

            this.router.navigate([
              '/admin/categories'
            ]);

          }, 800);

        },


        error: (error) => {

          this.loading = false;

          console.error(
            'Failed to update category:',
            error
          );


          const message =
            error?.error?.message ||
            'Failed to update category. Please try again.';


          this.showMessage(message);

        }

      });

  }


  // =========================================
  // FORM VALIDATION
  // =========================================

  isFormValid(): boolean {

    return !!(

      this.category.categoryName.trim() &&

      this.category.departmentId

    );

  }


  // =========================================
  // SELECTED DEPARTMENT
  // =========================================

  getSelectedDepartment():
    Department | undefined {

    if (!this.category.departmentId) {

      return undefined;

    }


    return this.departments.find(

      department =>

        department.departmentId ===
        Number(this.category.departmentId)

    );

  }


  // =========================================
  // CANCEL
  // =========================================

  cancel(): void {

    this.router.navigate([
      '/admin/categories'
    ]);

  }


  // =========================================
  // MESSAGE
  // =========================================

  private showMessage(
    message: string
  ): void {

    this.snackBar.open(

      message,

      'Close',

      {

        duration: 3000,

        horizontalPosition: 'right',

        verticalPosition: 'top'

      }

    );

  }

}