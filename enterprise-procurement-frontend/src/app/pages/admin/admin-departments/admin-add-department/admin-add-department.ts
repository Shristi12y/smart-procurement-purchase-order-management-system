import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-add-department',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],

  templateUrl: './admin-add-department.html',
  styleUrl: './admin-add-department.scss'
})
export class AdminAddDepartment {

  private apiUrl = 'http://localhost:8080/departments';

  department = {
    departmentName: '',
    manager: ''
  };

  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}


  // =========================================
  // ADD DEPARTMENT
  // =========================================

  addDepartment(): void {

    if (!this.isFormValid()) {

      this.showMessage(
        'Please fill all required fields.'
      );

      return;
    }

    this.loading = true;

    const department = {
      departmentName:
        this.department.departmentName.trim(),

      manager:
        this.department.manager.trim()
    };

    this.http
      .post(
        this.apiUrl,
        department
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Department added successfully:',
            response
          );

          this.loading = false;

          this.showMessage(
            'Department added successfully.'
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
            'Failed to add department:',
            error
          );

          const message =
            error?.error?.message ||
            'Failed to add department. Please try again.';

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