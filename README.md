# Smart Procurement – Purchase Order Management System

A full-stack enterprise procurement and purchase order management system designed to streamline the procurement process between administrators, employees, and suppliers.

The system provides features for product management, purchase requests, approval workflows, purchase orders, payments, supplier management, ratings, and user administration.

---

## 📌 Project Overview

The Smart Procurement Purchase Order Management System is a web-based application that digitizes and simplifies the procurement lifecycle.

The application supports multiple users and roles and provides a centralized platform for managing:

- Products
- Categories
- Departments
- Suppliers
- Purchase Requests
- Approval Workflows
- Purchase Orders
- Payments
- Supplier Ratings
- User Management

The project consists of an Angular frontend and a Spring Boot REST API backend.

---

## 🚀 Features

### 👤 User Management

- User registration and login
- Role-based access
- User profile management
- User status management
- Secure authentication

### 🛒 Product Management

- View available products
- Add products
- Edit products
- Manage product status
- Supplier-specific product management
- Category-based product organization

### 📋 Purchase Request Management

- Create purchase requests
- View purchase requests
- Submit requests for approval
- Track request status
- Admin approval management

### ✅ Approval Management

- Approval hierarchy
- Approval request management
- Approve or reject purchase requests
- Track approval status

### 📦 Purchase Order Management

- Generate purchase orders
- View purchase orders
- Track purchase order status
- Supplier purchase order management
- Purchase order notifications

### 💳 Payment Management

- Process payments
- Track payment status
- Support multiple payment methods
- Payment history
- Payment reports

### 🏢 Supplier Management

- Add suppliers
- Edit supplier information
- View supplier details
- Supplier dashboard
- Supplier product management
- Supplier payment history

### ⭐ Rating System

- Rate suppliers
- View supplier ratings
- Rating notifications
- Track user ratings

### 👨‍💼 Admin Dashboard

Administrators can manage:

- Users
- Suppliers
- Products
- Categories
- Departments
- Purchase requests
- Payments
- Approval workflows


## 🏗️ System Architecture

The application follows a client-server architecture:


┌───────────────────────────────┐
│        Angular Frontend       │
│                               │
│  • User Interface             │
│  • Admin Dashboard            │
│  • Supplier Dashboard         │
│  • Purchase Management        │
│  • Authentication             │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│       Spring Boot Backend     │
│                               │
│  • Controllers                │
│  • Services                   │
│  • Repositories               │
│  • DTOs                       │
│  • Exception Handling         │
│  • Email Services             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Database             │
│                               │
│  Users                        │
│  Products                     │
│  Suppliers                    │
│  Orders                       │
│  Payments                     │
│  Ratings                      │
│  Approvals                    │
└───────────────────────────────┘

---------------------------------------------------------------------------
🛠️ Technologies Used

**Frontend-**
  Angular
  TypeScript
  HTML5
  SCSS
  Angular Router
  Angular Services
  RxJS
  npm
  
**Backend-**
  Java
  Spring Boot
  Spring Web
  Spring Data JPA
  REST APIs
  Maven
  Jakarta Persistence / JPA

**Database-**
  Relational Database
  SQL
  Development Tools
  
**Visual Studio Code
IntelliJ IDEA / Eclipse
Git
GitHub
Postman**

--------------------------------------

**🔄 Procurement Workflow**

User
  │
  ▼
Select Product
  │
  ▼
Create Purchase Request
  │
  ▼
Submit Request
  │
  ▼
Approval Workflow
  │
  ├── Rejected ──► Request Closed
  │
  └── Approved
          │
          ▼
    Purchase Order
          │
          ▼
       Supplier
          │
          ▼
       Payment
          │
          ▼
    Order Completed
          │
          ▼
    Supplier Rating

---------------------------------------------------------------

**🎯 Objectives**

The main objectives of this project are to:

- Digitize procurement operations
- Reduce manual procurement processes
- Improve purchase request tracking
- Provide structured approval workflows
- Improve supplier management
- Centralize purchase order information
- Track payment activities
- Improve transparency across the procurement lifecycle
- Provide role-based access to different users


-----------------------------------------------------------------

**🔮 Future Enhancements**

Potential future improvements include:

- Advanced reporting and analytics
- Real-time notifications
- Advanced search and filtering
- Purchase order PDF generation
- Cloud deployment
- Automated approval rules
- Audit logging
- Enhanced authentication and authorization
- Dashboard analytics and visualizations
- Integration with external payment systems

---------------------------------------------------------------


