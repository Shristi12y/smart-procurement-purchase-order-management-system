import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-add-supplier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-add-supplier.html',
  styleUrl: './admin-add-supplier.scss'
})
export class AdminAddSupplierComponent {

  private apiUrl = 'http://localhost:8080/suppliers';

  supplier = {
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    accountNo: '',
    gstNumber: '',
    status: 'ACTIVE',
    rating: null as number | null,
    feedback: ''
  };

  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  addSupplier(): void {

    if (!this.isFormValid()) {
      this.showMessage('Please fill all required fields.');
      return;
    }

    this.loading = true;

    this.http.post(this.apiUrl, this.supplier).subscribe({
      next: () => {
        this.loading = false;

        this.showMessage('Supplier added successfully.');

        setTimeout(() => {
          this.router.navigate(['/admin/suppliers']);
        }, 800);
      },

      error: (error) => {
        this.loading = false;

        console.error('Error adding supplier:', error);

        const message =
          error?.error?.message ||
          'Failed to add supplier. Please try again.';

        this.showMessage(message);
      }
    });
  }

  isFormValid(): boolean {

    return !!(
      this.supplier.name.trim() &&
      this.supplier.phone.trim() &&
      this.supplier.address.trim() &&
      this.supplier.email.trim() &&
      this.supplier.password.trim() &&
      this.supplier.accountNo.trim() &&
      this.supplier.gstNumber.trim()
    );
  }

  cancel(): void {
    this.router.navigate(['/admin/suppliers']);
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}