import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Supplier {
  supplierId?: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  password?: string;
  accountNo: string;
  gstNumber: string;
  status: string;
  rating: number | null;
  feedback: string;
}

@Component({
  selector: 'app-admin-edit-supplier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-edit-supplier.html',
  styleUrl: './admin-edit-supplier.scss'
})
export class AdminEditSupplierComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/suppliers';

  supplierId!: number;

  supplier: Supplier = {
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    accountNo: '',
    gstNumber: '',
    status: 'ACTIVE',
    rating: null,
    feedback: ''
  };

  loading = false;
  loadingSupplier = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.showMessage('Invalid supplier ID.');
      this.router.navigate(['/admin/suppliers']);
      return;
    }

    this.supplierId = Number(id);

    this.loadSupplier();
  }

  loadSupplier(): void {

    this.loadingSupplier = true;

    this.http
      .get<Supplier>(`${this.apiUrl}/${this.supplierId}`)
      .subscribe({

        next: (data) => {

          this.supplier = {
            supplierId: data.supplierId,
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            email: data.email || '',
            password: data.password || '',
            accountNo: data.accountNo || '',
            gstNumber: data.gstNumber || '',
            status: data.status || 'ACTIVE',
            rating: data.rating ?? null,
            feedback: data.feedback || ''
          };

          this.loadingSupplier = false;
        },

        error: (error) => {

          console.error('Error loading supplier:', error);

          this.loadingSupplier = false;

          this.showMessage('Failed to load supplier.');

          this.router.navigate(['/admin/suppliers']);
        }
      });
  }

  updateSupplier(): void {

    if (!this.isFormValid()) {
      this.showMessage('Please fill all required fields.');
      return;
    }

    this.loading = true;

    this.http
      .put(`${this.apiUrl}/${this.supplierId}`, this.supplier)
      .subscribe({

        next: () => {

          this.loading = false;

          this.showMessage('Supplier updated successfully.');

          setTimeout(() => {
            this.router.navigate(['/admin/suppliers']);
          }, 800);
        },

        error: (error) => {

          this.loading = false;

          console.error('Error updating supplier:', error);

          const message =
            error?.error?.message ||
            'Failed to update supplier. Please try again.';

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