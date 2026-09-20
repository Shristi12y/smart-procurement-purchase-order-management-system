
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-supplier-products',
  standalone: true,

  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    RouterLink
  ],

  templateUrl: './supplier-products.html',
  styleUrl: './supplier-products.scss'
})
export class SupplierProducts implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchText = '';
  loading = true;
  supplierId: number | null = null;
  supplierName = '';

  private baseUrl = 'http://localhost:8080/products';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // INIT

  ngOnInit(): void {

    this.loadSupplierDetails();

    this.getProducts();

  }

  // SUPPLIER DETAILS

  loadSupplierDetails(): void {

    const id =
      localStorage.getItem('supplierId');

    const name =
      localStorage.getItem('name');


    if (id) {

      this.supplierId = Number(id);

    }


    if (name) {

      this.supplierName = name;

    }

  }

  // GET ALL PRODUCTS

  getProducts(): void {

    this.loading = true;

    this.http
      .get<any[]>(this.baseUrl)
      .subscribe({

        next: (response) => {

          console.log(
            'Supplier Products:',
            response
          );

          this.products = response;

          this.applyFilter();

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to fetch products:',
            error
          );

          this.products = [];

          this.filteredProducts = [];

          this.loading = false;

        }

      });

  }

  // SEARCH

  onSearch(): void {

    this.applyFilter();

  }


  applyFilter(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    if (!search) {

      this.filteredProducts = [
        ...this.products
      ];

      return;

    }


    this.filteredProducts =
      this.products.filter(product =>

        product.name
          ?.toLowerCase()
          .includes(search)

        ||

        product.description
          ?.toLowerCase()
          .includes(search)

        ||

        product.category?.categoryName
          ?.toLowerCase()
          .includes(search)

        ||

        product.supplier?.name
          ?.toLowerCase()
          .includes(search)

      );

  }

  // CHECK PRODUCT OWNERSHIP

  isMyProduct(product: any): boolean {

    if (!this.supplierId) {

      return false;

    }


    return (
      Number(product.supplier?.supplierId) ===
      Number(this.supplierId)
    );

  }

  // EDIT PERMISSION

  canEditProduct(product: any): boolean {

    return this.isMyProduct(product);

  }

  // DELETE PERMISSION

  canDeleteProduct(product: any): boolean {

    return this.isMyProduct(product);

  }

  // EDIT PRODUCT

  editProduct(productId: number): void {

    console.log(
      'Editing supplier product:',
      productId
    );


    if (!productId) {

      console.error(
        'Product ID is missing'
      );

      return;

    }


    this.router.navigate([
      '/supplier/edit-product',
      productId
    ]);

  }


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  deleteProduct(productId: number): void {

  if (!productId) {
    console.error('Product ID is missing:', productId);
    return;
  }

  const confirmed = confirm(
    'Are you sure you want to delete this product?'
  );

  if (!confirmed) {
    return;
  }

  console.log(
    'Deleting Supplier Product ID:',
    productId
  );

  this.http.delete(
    `http://localhost:8080/products/${productId}`,
    {
      responseType: 'text'
    }
  )
  .subscribe({

    next: (response) => {

      console.log(
        'Product deleted successfully:',
        response
      );

      alert(
        'Product deleted successfully!'
      );

      // Refresh product list
      this.getProducts();

    },

    error: (error) => {

      console.error(
        'Failed to delete product:',
        error
      );

      console.error(
        'Backend response:',
        error.error
      );

      if (error.status === 403) {

        alert(
          'You are not authorized to delete this product.'
        );

      }
      else if (error.status === 404) {

        alert(
          'Product not found.'
        );

      }
      else if (error.status === 400) {

        alert(
          error.error?.message ||
          'Product cannot be deleted.'
        );

      }
      else {

        alert(
          error.error?.message ||
          'Failed to delete product.'
        );

      }

    }

  });

}


  // STOCK STATUS

  getStockStatus(
    quantity: number
  ): string {

    if (quantity === 0) {

      return 'Out of Stock';

    }


    if (quantity <= 10) {

      return 'Low Stock';

    }


    return 'In Stock';

  }

  // TOTAL MY PRODUCTS

  get myProductsCount(): number {

    return this.products.filter(
      product =>
        this.isMyProduct(product)
    ).length;

  }

  // TOTAL PRODUCTS

  get totalProductsCount(): number {

    return this.products.length;

  }

  // MY PRODUCT COUNT

  get myProductCount(): number {

    return this.products.filter(
      product =>
        this.isMyProduct(product)
    ).length;

  }

}

