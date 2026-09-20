import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  selectedRole = 'USER';

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }


  selectRole(role: string) {
    this.selectedRole = role;
  }


  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .login(this.loginForm.value, this.selectedRole)
      .subscribe({

        next: (response: any) => {

  console.log('Login Successful:', response);

  localStorage.clear();

  localStorage.setItem('role', this.selectedRole);

  if (response.name) {
    localStorage.setItem('name', response.name);
  }
  
  if (this.selectedRole === 'USER') {

    console.log('User ID:', response.userId);

    if (response.userId != null) {
      localStorage.setItem(
        'userId',
        String(response.userId)
      );
    }
  }

  else if (this.selectedRole === 'ADMIN') {
    localStorage.setItem('admin', 'administrator');
    
  }

  else if (this.selectedRole === 'SUPPLIER') {

  console.log('Supplier Login Response:', response);
  console.log('Supplier ID:', response.supplierId);

  if (response.supplierId) {

    localStorage.setItem(
      'supplierId',
      response.supplierId.toString()
    );

    console.log(
      'Stored Supplier ID:',
      localStorage.getItem('supplierId')
    );
  } else {

    console.error(
      'supplierId is missing from login response'
    );
  }
}

  if (this.selectedRole === 'ADMIN') {

  this.router.navigate([
    '/admin/dashboard'
  ]);

}
else if (this.selectedRole === 'USER') {

  this.router.navigate([
    '/dashboard'
  ]);

}
else if (this.selectedRole === 'SUPPLIER') {

  this.router.navigate([
    '/supplier/dashboard'
  ]);

}
},

        error: (error) => {

          console.error('Login failed:', error);

          alert(
            error.error?.message ||
            `${this.selectedRole} login failed`
          );
        }

      });
  }
}