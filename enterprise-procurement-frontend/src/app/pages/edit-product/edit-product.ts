import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct implements OnInit {

  productId!: number;

  name = '';
  pricePerProduct: number | null = null;
  numberOfQuantities: number | null = null;
  description = '';
  status = 'ACTIVE';

  departmentId: number | null = null;
  categoryId: number | null = null;
  supplierId: number | null = null;

  departments: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];

  userRole = localStorage.getItem('role');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.getDepartments();
    this.getCategories();

    if (this.userRole === 'ADMIN') {
      this.getSuppliers();
    }

    this.getProductById();

  }
  getDepartments(): void {

  this.http
    .get<any[]>('http://localhost:8080/departments')
    .subscribe({

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

  this.http
    .get<any[]>('http://localhost:8080/categories')
    .subscribe({

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

  this.http
    .get<any[]>('http://localhost:8080/suppliers')
    .subscribe({

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


  getProductById(): void {

  this.http
    .get<any>(
      `http://localhost:8080/products/${this.productId}`
    )
    .subscribe({

      next: (product) => {

        console.log('Product:', product);

        this.name = product.name;

        this.pricePerProduct =
          product.pricePerProduct;

        this.numberOfQuantities =
          product.numberOfQuantities;

        this.description =
          product.description;

        this.departmentId =
          product.department?.departmentId ?? null;

        this.categoryId =
          product.category?.categoryId ?? null;

        if (this.userRole === 'SUPPLIER') {

  this.supplierId = Number(
    localStorage.getItem('supplierId')
  );

} else {

  this.supplierId =
    product.supplier?.supplierId ?? null;

}

      },

      error: (error) => {

        console.error(
          'Failed to fetch product:',
          error
        );

      }

    });

}


  updateProduct(): void {

  let finalSupplierId: number | null;

  if (this.userRole === 'SUPPLIER') {

    const storedSupplierId =
      localStorage.getItem('supplierId');

    if (!storedSupplierId) {

      alert('Supplier ID not found. Please login again.');

      return;
    }

    finalSupplierId = Number(storedSupplierId);

  } else {

    finalSupplierId = this.supplierId;

  }

  if (!finalSupplierId) {

    alert('Please select a supplier.');

    return;

  }

  const productData = {

    name: this.name,

    pricePerProduct: this.pricePerProduct,

    numberOfQuantities:
      this.numberOfQuantities,

    description: this.description,

    status: this.status,

    supplier: {
      supplierId: finalSupplierId
    },

    department: {
      departmentId: this.departmentId
    },

    category: {
      categoryId: this.categoryId
    }

  };

  console.log(
    'Updating Product:',
    productData
  );

  this.http.put(
    `http://localhost:8080/products/${this.productId}`,
    productData
  ).subscribe({

    next: (response) => {

      console.log(
        'Product updated successfully:',
        response
      );

      alert('Product updated successfully!');

      this.router.navigate(['/products']);

    },

    error: (error) => {

      console.error(
        'Failed to update product:',
        error
      );

      alert(
        error.error?.message ||
        'Failed to update product.'
      );

    }

  });

}

}