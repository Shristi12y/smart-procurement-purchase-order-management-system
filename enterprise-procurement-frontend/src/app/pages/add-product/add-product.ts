import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct implements OnInit{

  name = '';
  pricePerProduct: number | null = null;
  numberOfQuantities: number | null = null;
  description = '';

  departmentId: number | null = null;
  categoryId: number | null = null;
  selectedSupplierId: number | null = null;

  departments: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];
  userRole = localStorage.getItem('role');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {

    this.getDepartments();
    this.getCategories();

    if (this.userRole === 'ADMIN') {
      this.getSuppliers();
    }

  }

  getDepartments(): void {

  this.http.get<any[]>(
    'http://localhost:8080/departments'
  ).subscribe({

    next: (response) => {

      console.log('Departments:', response);

      this.departments = response;

    },

    error: (error) => {

      console.error(
        'Failed to fetch departments:',
        error
      );

    }

  });

}
getCategories(): void {

  this.http.get<any[]>(
    'http://localhost:8080/categories'
  ).subscribe({

    next: (response) => {

      console.log('Categories:', response);

      this.categories = response;

    },

    error: (error) => {

      console.error(
        'Failed to fetch categories:',
        error
      );

    }

  });

}
getSuppliers(): void {

  this.http.get<any[]>(
    'http://localhost:8080/suppliers'
  ).subscribe({

    next: (response) => {

      console.log('Suppliers:', response);

      this.suppliers = response;

    },

    error: (error) => {

      console.error(
        'Failed to fetch suppliers:',
        error
      );

    }

  });

}
  addProduct() {

  const role = localStorage.getItem('role');

  console.log('Current Role:', role);
  console.log(
    'Stored Supplier ID:',
    localStorage.getItem('supplierId')
  );

  let supplierId: number | null = null;

  if (role === 'SUPPLIER') {

    const storedSupplierId =
      localStorage.getItem('supplierId');

    if (storedSupplierId === null) {

      alert('Supplier ID not found. Please login again.');
      return;
    }

    supplierId = Number(storedSupplierId);

    if (isNaN(supplierId) || supplierId <= 0) {

      alert('Invalid Supplier ID. Please login again.');
      return;
    }
  }

  if (role === 'ADMIN') {

    supplierId = this.selectedSupplierId;

    if (supplierId === null) {

      alert('Please enter Supplier ID');
      return;
    }
  }

  const productData = {

    name: this.name,

    pricePerProduct: this.pricePerProduct,

    numberOfQuantities: this.numberOfQuantities,

    description: this.description,

    status: 'ACTIVE',

    supplier: {
      supplierId: supplierId
    },

    department: {
      departmentId: this.departmentId
    },

    category: {
      categoryId: this.categoryId
    }
  };

  console.log(
    'Sending Product:',
    JSON.stringify(productData, null, 2)
  );

  this.http.post(
    'http://localhost:8080/products',
    productData
  ).subscribe({

    next: (response) => {

      console.log(
        'Product Added Successfully:',
        response
      );

      alert('Product added successfully!');

      this.router.navigate(['/products']);
    },

    error: (error) => {

      console.error(
        'Failed to add product:',
        error
      );

      alert(
        error.error?.message ||
        'Failed to add product.'
      );
    }
  });
}
}