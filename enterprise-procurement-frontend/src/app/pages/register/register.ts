import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  selectedRole: 'USER' | 'SUPPLIER' = 'USER';

  name = '';
  email = '';
  phone = '';
  password = '';

  designation = '';
  departmentId: number | null = null;

  accountNo = '';
  address = '';
  gstNumber = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  selectRole(role: 'USER' | 'SUPPLIER') {

    this.selectedRole = role;

    // Clear all fields for a completely fresh form
    this.name = '';
    this.email = '';
    this.phone = '';
    this.password = '';

    this.designation = '';
    this.departmentId = null;

    this.accountNo = '';
    this.address = '';
    this.gstNumber = '';
  }

  register() {

    if (this.selectedRole === 'USER') {

  if (this.departmentId === null) {
    alert('Please enter Department ID');
    return;
  }

  const userData = {
    name: this.name,
    email: this.email,
    phoneNumber: this.phone,
    password: this.password,
    designation: this.designation,

    department: {
      departmentId: this.departmentId
    }
  };

  console.log('Sending User Data:', userData);

  this.http.post(
    'http://localhost:8080/users/register',
    userData
  ).subscribe({

    next: (response) => {

      console.log('User Registration Successful:', response);

      alert('User registered successfully! Please login.');

      this.router.navigate(['/login']);
    },

    error: (error) => {

      console.error('User Registration Failed:', error);

      alert(
        error.error?.message ||
        'Registration failed. Please try again.'
      );
    }

  });

    } else {

      const supplierData = {
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        address: this.address,
        accountNo: this.accountNo,
        gstNumber: this.gstNumber
      };

      this.http.post(
        'http://localhost:8080/suppliers',
        supplierData
      ).subscribe({

        next: (response) => {

          console.log('Supplier Registration Successful:', response);

          alert('Supplier registered successfully! Please login.');

          this.router.navigate(['/login']);
        },

        error: (error) => {

          console.error('Supplier Registration Failed:', error);

          alert(
            error.error?.message ||
            'Registration failed. Please try again.'
          );
        }

      });

    }
  }
}