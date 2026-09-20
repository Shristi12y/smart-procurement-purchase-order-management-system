import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

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

@Component({
  selector: 'app-admin-add-category',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-add-category.html',
  styleUrl: './admin-add-category.scss'
})
export class AdminAddCategory implements OnInit {

  private categoryApi =
    'http://localhost:8080/categories';

  private departmentApi =
    'http://localhost:8080/departments';


  departments: Department[] = [];

  loading = false;
  loadingDepartments = true;


  category = {
    categoryName: '',
    departmentId: null as number | null
  };


  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {

    this.loadDepartments();

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

          this.departments = response || [];

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
  // ADD CATEGORY
  // =========================================

  addCategory(): void {

    if (!this.isFormValid()) {

      this.showMessage(
        'Please enter category name and select a department.'
      );

      return;

    }


    this.loading = true;


    const categoryPayload = {

      categoryName:
        this.category.categoryName.trim(),

      department: {

        departmentId:
          this.category.departmentId

      }

    };


    console.log(
      'Adding category:',
      categoryPayload
    );


    this.http
      .post(
        this.categoryApi,
        categoryPayload
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Category added:',
            response
          );

          this.loading = false;

          this.showMessage(
            'Category added successfully.'
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
            'Failed to add category:',
            error
          );


          const message =
            error?.error?.message ||
            'Failed to add category. Please try again.';


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
  // GET SELECTED DEPARTMENT
  // =========================================

  getSelectedDepartment(): Department | undefined {

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