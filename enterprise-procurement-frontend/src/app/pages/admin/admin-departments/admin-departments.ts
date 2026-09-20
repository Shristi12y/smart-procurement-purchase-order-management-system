import { CommonModule, NgClass, DecimalPipe } from '@angular/common';
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

@Component({
  selector: 'app-admin-departments',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],

  templateUrl: './admin-departments.html',
  styleUrl: './admin-departments.scss'
})
export class AdminDepartments implements OnInit {

  private apiUrl = 'http://localhost:8080/departments';

  departments: any[] = [];
  filteredDepartments: any[] = [];

  loading = false;

  searchText = '';

  showDepartmentDetails = false;
  selectedDepartment: any = null;


  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.getDepartments();
  }


  // =========================================
  // GET ALL DEPARTMENTS
  // =========================================

  getDepartments(): void {

    this.loading = true;

    this.http
      .get<any[]>(this.apiUrl)
      .subscribe({

        next: (response) => {

          console.log(
            'Departments received:',
            response
          );

          this.departments = response || [];

          this.filteredDepartments =
            [...this.departments];

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to fetch departments:',
            error
          );

          this.loading = false;

          this.snackBar.open(
            error?.error?.message ||
            'Failed to load departments.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar']
            }
          );
        }

      });
  }


  // =========================================
  // SEARCH
  // =========================================

  filterDepartments(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    if (!search) {

      this.filteredDepartments =
        [...this.departments];

      return;
    }


    this.filteredDepartments =
      this.departments.filter(
        department => {

          const name =
            department.departmentName
              ?.toLowerCase() || '';

          const manager =
            department.manager
              ?.toLowerCase() || '';


          return (
            name.includes(search) ||
            manager.includes(search)
          );

        }
      );
  }


  // =========================================
  // CLEAR SEARCH
  // =========================================

  clearSearch(): void {

    this.searchText = '';

    this.filteredDepartments =
      [...this.departments];
  }


  // =========================================
  // SUMMARY
  // =========================================

  getTotalDepartmentsCount(): number {

    return this.departments.length;
  }


  getDepartmentsWithManagerCount(): number {

    return this.departments.filter(
      department =>
        department.manager &&
        department.manager.trim()
    ).length;
  }


  getDepartmentsWithoutManagerCount(): number {

    return this.departments.filter(
      department =>
        !department.manager ||
        !department.manager.trim()
    ).length;
  }


  getManagerCount(): number {

    const managers =
      this.departments
        .map(
          department =>
            department.manager
        )
        .filter(
          manager =>
            manager &&
            manager.trim()
        )
        .map(
          manager =>
            manager.toLowerCase().trim()
        );

    return new Set(managers).size;
  }


  // =========================================
  // ADD DEPARTMENT
  // =========================================

  addDepartment(): void {

    this.router.navigate([
      '/admin/add-department'
    ]);
  }


  // =========================================
  // VIEW DEPARTMENT
  // =========================================

  viewDepartment(
    department: any
  ): void {

    this.selectedDepartment =
      department;

    this.showDepartmentDetails =
      true;
  }


  // =========================================
  // CLOSE DETAILS
  // =========================================

  closeDepartmentDetails(): void {

    this.showDepartmentDetails =
      false;

    this.selectedDepartment =
      null;
  }


  // =========================================
  // EDIT DEPARTMENT
  // =========================================

  editDepartment(
    departmentId: number
  ): void {

    console.log(
      'Editing Admin Department ID:',
      departmentId
    );


    if (!departmentId) {

      console.error(
        'Department ID is missing:',
        departmentId
      );

      return;
    }


    this.closeDepartmentDetails();


    this.router.navigate([
      '/admin/edit-department',
      departmentId
    ]);
  }


  // =========================================
  // DELETE DEPARTMENT
  // =========================================

  deleteDepartment(
    department: any
  ): void {

    if (!department?.departmentId) {
      return;
    }


    const dialogRef =
      this.dialog.open(
        ConfirmDialog,
        {
          width: '420px',

          data: {

            title:
              'Delete Department',

            message:
              `Are you sure you want to delete department "${department.departmentName}"?`,

            icon:
              'delete_forever'

          }
        }
      );


    dialogRef
      .afterClosed()
      .subscribe(
        confirmed => {

          if (!confirmed) {
            return;
          }


          this.performDeleteDepartment(
            department.departmentId
          );

        }
      );
  }


  // =========================================
  // PERFORM DELETE
  // =========================================

  private performDeleteDepartment(
    departmentId: number
  ): void {

    this.http
      .delete(
        `${this.apiUrl}/${departmentId}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Department deleted:',
            response
          );


          this.snackBar.open(
            'Department deleted successfully.',
            'Close',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );


          this.getDepartments();
        },

        error: (error) => {

          console.error(
            'Failed to delete department:',
            error
          );


          this.snackBar.open(
            error?.error?.message ||
            'Failed to delete department.',
            'Close',
            {
              duration: 4000,
              panelClass: ['error-snackbar']
            }
          );
        }

      });
  }


  // =========================================
  // DEPARTMENT INITIAL
  // =========================================

  getDepartmentInitial(
    name: string
  ): string {

    if (!name) {
      return 'D';
    }


    return name
      .charAt(0)
      .toUpperCase();
  }

}