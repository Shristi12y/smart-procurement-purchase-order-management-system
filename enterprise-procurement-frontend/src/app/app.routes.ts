import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/products/products';
import { AddProduct } from './pages/add-product/add-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { PurchaseRequest } from './pages/purchase-request/purchase-request';
import { Home } from './pages/home/home';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { MyOrders } from './pages/my-orders/my-orders';
import { MyRatings } from './pages/my-ratings/my-ratings';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminUsers } from './pages/admin/admin-users/admin-users';
import { AdminPurchaseRequests } from './pages/admin/admin-purchase-requests/admin-purchase-requests';
import { AdminProducts } from './pages/admin/admin-products/admin-products';
import { AdminEditProduct } from './pages/admin/admin-edit-product/admin-edit-product';
import { AdminSuppliers } from './pages/admin/admin-suppliers/admin-suppliers';
import { AdminAddSupplierComponent } from './pages/admin/admin-suppliers/admin-add-supplier/admin-add-supplier';
import { AdminEditSupplierComponent } from './pages/admin/admin-suppliers/admin-edit-supplier/admin-edit-supplier';
import { AdminCategories } from './pages/admin/admin-categories/admin-categories';
import { AdminAddCategory } from './pages/admin/admin-categories/admin-add-category/admin-add-category';
import { AdminEditCategory } from './pages/admin/admin-categories/admin-edit-category/admin-edit-category';
import { AdminDepartments } from './pages/admin/admin-departments/admin-departments';
import { AdminAddDepartment } from './pages/admin/admin-departments/admin-add-department/admin-add-department';
import { AdminEditDepartment } from './pages/admin/admin-departments/admin-edit-department/admin-edit-department';
import { AdminPayments } from './pages/admin/admin-payments/admin-payments';
import { AdminMakePayment } from './pages/admin/admin-payments/admin-make-payment/admin-make-payment';
import { SupplierLayout } from './components/supplier/supplier-layout/supplier-layout';
import { SupplierDashboard } from './components/supplier/supplier-dashboard/supplier-dashboard';
import { SupplierPurchaseOrder } from './pages/supplier/supplier-purchase-order/supplier-purchase-order';
import { SupplierProducts } from './pages/supplier/supplier-products/supplier-products';
import { SupplierEditProduct } from './pages/supplier/supplier-edit-product/supplier-edit-product';
import { SupplierAddProduct } from './pages/supplier/supplier-add-product/supplier-add-product';
import { SupplierPayments } from './pages/supplier/supplier-payments/supplier-payments';
import { PaymentHistory } from './pages/supplier/payment-history/payment-history';
import { Rating } from './pages/supplier/rating/rating';
import { SupplierProfile } from './pages/supplier/supplier-profile/supplier-profile';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  // user
  {
    path: '',
    component: MainLayout,

    children: [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'products',
    component: Products
  },
  {
    path: 'add-product',
    component: AddProduct
  },
  {
    path: 'edit-product/:id',
    component: EditProduct
  },
  {
    path: 'purchase-request',
    component: PurchaseRequest
  },
  {
    path: 'my-requests',
    component: PurchaseRequest
  },
  {
    path: 'my-orders',
    component: MyOrders
  },
  {
    path: 'my-ratings',
    component: MyRatings
  }
    ]
  },

  // admin
  {
    path: 'admin',
    component: AdminLayout,

    children: [
      {
        path: 'dashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        component: AdminUsers
      },
      {
        path: 'purchase-requests',
        component: AdminPurchaseRequests
      },
      {
        path: 'products',
        component: AdminProducts
      },
      {
        path: 'edit-product/:id',
        component: AdminEditProduct
      },
      {
        path: 'suppliers',
        component: AdminSuppliers
      },
      {
        path: 'add-supplier',
        component: AdminAddSupplierComponent
      },
      {
        path: 'edit-supplier/:id',
        component: AdminEditSupplierComponent
      },
      {
        path: 'categories',
        component: AdminCategories
      },
      {
        path: 'add-category',
        component: AdminAddCategory
      },
      {
        path: 'edit-category/:id',
        component: AdminEditCategory
      },
      {
        path: 'departments',
        component: AdminDepartments
      },
      {
        path: 'add-department',
        component: AdminAddDepartment
      },
      {
        path: 'edit-department/:id',
        component: AdminEditDepartment
      },
      {
        path: 'payments',
        component: AdminPayments
      },
      {
        path: 'make-payment',
        component: AdminMakePayment
      }


    ]

  },

//supplier
  {
    path: 'supplier',
    component: SupplierLayout,

    children: [

      {
        path: 'dashboard',
        component: SupplierDashboard
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {path: 'purchase-orders',
        component: SupplierPurchaseOrder
      },
      {
        path:'products',
        component: SupplierProducts
      },
      {
        path: 'add-product',
        component: SupplierAddProduct
      },
      {
        path: 'edit-product/:id',
        component: SupplierEditProduct
      },
      {
        path: 'payments',
        component: SupplierPayments
      },
      {
        path: 'payment-history',
        component: PaymentHistory
      },
      {
        path: 'rating',
        component: Rating
      },
      {
        path: 'profile',
        component: SupplierProfile
      }


    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // Unknown route
  {
    path: '**',
    redirectTo: 'login'
  }

];