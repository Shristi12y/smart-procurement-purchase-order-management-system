
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    FormsModule
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {

  products: any[] = [];

  searchText = '';

  userRole = localStorage.getItem('role');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }


  get filteredProducts(): any[] {

    const search =
      this.searchText.toLowerCase().trim();

    if (!search) {
      return this.products;
    }

    return this.products.filter(product =>
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.category?.categoryName?.toLowerCase().includes(search) ||
      product.supplier?.name?.toLowerCase().includes(search)
    );

  }

createPurchaseRequest(productId: number): void {

  this.router.navigate(
    ['/purchase-request'],
    {
      queryParams: {
        productId: productId
      }
    }
  );

}
  canModifyProduct(product: any): boolean {

    if (this.userRole === 'ADMIN') {
      return true;
    }

    if (this.userRole === 'SUPPLIER') {

      const supplierId = Number(
        localStorage.getItem('supplierId')
      );

      return product.supplier?.supplierId === supplierId;
    }

    return false;

  }


  getStockStatus(quantity: number): string {

    if (quantity === 0) {
      return 'Out of Stock';
    }

    if (quantity <= 10) {
      return 'Low Stock';
    }

    return 'In Stock';

  }


  getProducts(): void {

    this.http
      .get<any[]>(
        'http://localhost:8080/products'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Products received:',
            response
          );

          this.products = response;

        },

        error: (error) => {

          console.error(
            'Failed to fetch products:',
            error
          );

        }

      });

  }


  requestProduct(product: any): void {

    this.router.navigate(
      ['/purchase-request'],
      {
        queryParams: {
          productId: product.productId
        }
      }
    );

  }


  editProduct(productId: number): void {

    console.log(
      'Editing Product ID:',
      productId
    );

    if (!productId) {

      console.error(
        'Product ID is missing:',
        productId
      );

      return;

    }

    this.router.navigate([
      '/edit-product',
      productId
    ]);

  }


  deleteProduct(productId: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this product?'
      )
    ) {
      return;
    }

    this.http.delete(
      `http://localhost:8080/products/${productId}`,
      {
        responseType: 'text'
      }
    ).subscribe({

      next: (response) => {

        console.log(response);

        alert(
          'Product deleted successfully!'
        );

        this.getProducts();

      },

      error: (error) => {

        console.error(
          'Failed to delete product:',
          error
        );

        alert(
          error.error?.message ||
          'Failed to delete product.'
        );

      }

    });

  }

}

