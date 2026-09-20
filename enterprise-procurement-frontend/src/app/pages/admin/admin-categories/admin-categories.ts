import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import { ConfirmDialog } from '../../../confirm-dialog/confirm-dialog';


interface Department {
  departmentId: number;
  departmentName: string;
  manager: string;
}


interface Category {
  categoryId: number;
  categoryName: string;
  department?: {
    departmentId: number;
  };
}


@Component({
  selector: 'app-admin-categories',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],

  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.scss'
})
export class AdminCategories implements OnInit {

  private categoryApi =
    'http://localhost:8080/categories';

  private departmentApi =
    'http://localhost:8080/departments';


  categories: Category[] = [];

  filteredCategories: Category[] = [];

  departments: Department[] = [];


  loading = false;

  searchText = '';

  selectedDepartment = 'ALL';


  showCategoryDetails = false;

  selectedCategory: Category | null = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {

    this.loadCategories();

    this.loadDepartments();

  }


  // LOAD CATEGORIES

  loadCategories(): void {

    this.loading = true;

    this.http
      .get<Category[]>(this.categoryApi)
      .subscribe({

        next: (response) => {

          console.log(
            'Categories received:',
            response
          );

          this.categories =
            response || [];

          this.filteredCategories =
            [...this.categories];

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load categories:',
            error
          );

          this.loading = false;

          this.showMessage(
            error?.error?.message ||
            'Failed to load categories.',
            true
          );

        }

      });

  }

  // LOAD DEPARTMENTS

  loadDepartments(): void {

    this.http
      .get<Department[]>(
        this.departmentApi
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Departments received:',
            response
          );

          this.departments =
            response || [];

        },

        error: (error) => {

          console.error(
            'Failed to load departments:',
            error
          );

          this.showMessage(
            'Failed to load departments.',
            true
          );

        }

      });

  }

  // FILTER

  filterCategories(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    this.filteredCategories =
      this.categories.filter(
        category => {

          const categoryName =
            category.categoryName
              ?.toLowerCase() || '';


          const departmentName =
            this.getDepartmentName(
              category
            )
              .toLowerCase();


          const matchesSearch =
            categoryName.includes(search) ||
            departmentName.includes(search);


          const matchesDepartment =

            this.selectedDepartment ===
            'ALL' ||

            this.getDepartmentId(
              category
            ) ===
            Number(
              this.selectedDepartment
            );


          return (
            matchesSearch &&
            matchesDepartment
          );

        }
      );

  }

  // CLEAR FILTERS

  clearFilters(): void {

    this.searchText = '';

    this.selectedDepartment =
      'ALL';

    this.filteredCategories =
      [...this.categories];

  }

  // SUMMARY

  getTotalCategoriesCount(): number {

    return this.categories.length;

  }


  getAssignedCategoriesCount(): number {

    return this.categories.filter(
      category =>
        !!this.getDepartmentId(category)
    ).length;

  }


  getUnassignedCategoriesCount(): number {

    return this.categories.filter(
      category =>
        !this.getDepartmentId(category)
    ).length;

  }


  getDepartmentCount(): number {

    const departmentIds =
      this.categories

        .map(category =>
          this.getDepartmentId(category)
        )

        .filter(
          id => !!id
        );


    return new Set(
      departmentIds
    ).size;

  }

  // DEPARTMENT HELPERS

  getDepartmentId(
    category: Category
  ): number | null {

    return category.department
      ?.departmentId || null;

  }


  getDepartmentName(
    category: Category
  ): string {

    const departmentId =
      this.getDepartmentId(category);


    if (!departmentId) {

      return 'Not Assigned';

    }


    const department =
      this.departments.find(
        dept =>
          dept.departmentId ===
          departmentId
      );


    return department?.departmentName ||
      'Not Assigned';

  }


  getDepartmentManager(
    category: Category
  ): string {

    const departmentId =
      this.getDepartmentId(category);


    if (!departmentId) {

      return 'Not Available';

    }


    const department =
      this.departments.find(
        dept =>
          dept.departmentId ===
          departmentId
      );


    return department?.manager ||
      'Not Available';

  }

  // VIEW

  viewCategory(
    category: Category
  ): void {

    this.selectedCategory =
      category;

    this.showCategoryDetails =
      true;

  }

  // CLOSE VIEW

  closeCategoryDetails(): void {

    this.showCategoryDetails =
      false;

    this.selectedCategory =
      null;

  }

  // ADD CATEGORY

  addCategory(): void {

    this.router.navigate([
      '/admin/add-category'
    ]);

  }

  // EDIT CATEGORY

  editCategory(
    categoryId: number
  ): void {

    console.log(
      'Editing Admin Category ID:',
      categoryId
    );


    if (!categoryId) {

      console.error(
        'Category ID is missing:',
        categoryId
      );

      return;

    }


    this.closeCategoryDetails();


    this.router.navigate([
      '/admin/edit-category',
      categoryId
    ]);

  }

  // DELETE CATEGORY

  deleteCategory(
    category: Category
  ): void {

    if (!category?.categoryId) {

      return;

    }


    const dialogRef =
      this.dialog.open(
        ConfirmDialog,
        {
          width: '420px',

          data: {

            title:
              'Delete Category',

            message:
              `Are you sure you want to delete category "${category.categoryName}"?`,

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


          this.performDeleteCategory(
            category.categoryId
          );

        }
      );

  }

  // PERFORM DELETE

  private performDeleteCategory(
    categoryId: number
  ): void {

    this.http
      .delete(
        `${this.categoryApi}/${categoryId}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Category deleted:',
            response
          );


          this.showMessage(
            'Category deleted successfully.'
          );


          this.loadCategories();

        },

        error: (error) => {

          console.error(
            'Failed to delete category:',
            error
          );


          this.showMessage(
            error?.error?.message ||
            'Failed to delete category.',
            true
          );

        }

      });

  }

  // SNACKBAR

  private showMessage(
    message: string,
    error = false
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
          error
            ? ['error-snackbar']
            : ['success-snackbar']
      }
    );

  }

}