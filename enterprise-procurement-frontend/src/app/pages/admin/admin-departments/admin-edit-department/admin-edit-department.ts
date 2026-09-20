import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

interface Department {
  departmentId?: number;
  departmentName: string;
  manager: string;
}

@Component({
  selector: 'app-admin-edit-department',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-edit-department.html',
  styleUrl: './admin-edit-department.scss'
})
export class AdminEditDepartment implements OnInit {

  private apiUrl = 'http://localhost:8080/departments';

  departmentId!: number;

  department: Department = {
    departmentName: '',
    manager: ''
  };

  loading = false;
  loadingDepartment = true;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  // =========================================
  // INITIALIZE
  // =========================================

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.showMessage(
        'Invalid department ID.'
      );

      this.router.navigate([
        '/admin/departments'
      ]);

      return;
    }

    this.departmentId = Number(id);

    console.log(
      'Editing Admin Department ID:',
      this.departmentId
    );

    this.loadDepartment();
  }


  // =========================================
  // LOAD DEPARTMENT
  // =========================================

  loadDepartment(): void {

    this.loadingDepartment = true;

    this.http
      .get<Department>(
        `${this.apiUrl}/${this.departmentId}`
      )
      .subscribe({

        next: (data) => {

          console.log(
            'Department received:',
            data
          );

          this.department = {

            departmentId:
              data.departmentId,

            departmentName:
              data.departmentName || '',

            manager:
              data.manager || ''

          };

          this.loadingDepartment = false;
        },

        error: (error) => {

          console.error(
            'Failed to load department:',
            error
          );

          this.loadingDepartment = false;

          const message =
            error?.error?.message ||
            'Failed to load department.';

          this.showMessage(message);

          setTimeout(() => {

            this.router.navigate([
              '/admin/departments'
            ]);

          }, 500);
        }

      });

  }


  // =========================================
  // UPDATE DEPARTMENT
  // =========================================

  updateDepartment(): void {

    if (!this.isFormValid()) {

      this.showMessage(
        'Please fill all required fields.'
      );

      return;
    }

    this.loading = true;

    const updatedDepartment = {

      departmentName:
        this.department.departmentName.trim(),

      manager:
        this.department.manager.trim()

    };

    console.log(
      'Updating department:',
      updatedDepartment
    );

    this.http
      .put(
        `${this.apiUrl}/${this.departmentId}`,
        updatedDepartment
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Department updated successfully:',
            response
          );

          this.loading = false;

          this.showMessage(
            'Department updated successfully.'
          );

          setTimeout(() => {

            this.router.navigate([
              '/admin/departments'
            ]);

          }, 800);
        },

        error: (error) => {

          this.loading = false;

          console.error(
            'Failed to update department:',
            error
          );

          const message =
            error?.error?.message ||
            'Failed to update department. Please try again.';

          this.showMessage(message);
        }

      });

  }


  // =========================================
  // FORM VALIDATION
  // =========================================

  isFormValid(): boolean {

    return !!(
      this.department.departmentName.trim() &&
      this.department.manager.trim()
    );

  }


  // =========================================
  // CANCEL
  // =========================================

  cancel(): void {

    this.router.navigate([
      '/admin/departments'
    ]);

  }


  // =========================================
  // SNACKBAR
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