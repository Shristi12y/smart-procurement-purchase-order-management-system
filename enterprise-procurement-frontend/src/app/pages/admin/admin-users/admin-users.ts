import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../confirm-dialog/confirm-dialog';



@Component({
  selector: 'app-admin-users',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],

  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss'
})


export class AdminUsers implements OnInit {

  users: any[] = [];

  filteredUsers: any[] = [];

  loading = false;

  searchText = '';

  selectedDepartment = 'ALL';

  selectedDesignation = 'ALL';

  selectedUser: any = null;

  showUserDetails = false;

  totalUsers = 0;

  departments: string[] = [];

  designations: string[] = [];


  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {

    this.loadUsers();

  }

  // LOAD USERS

  loadUsers(): void {

    this.loading = true;

    this.http
      .get<any[]>(
        'http://localhost:8080/admin/users'
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Admin Users:',
            response
          );

          this.users = response || [];

          this.filteredUsers = [
            ...this.users
          ];

          this.totalUsers =
            this.users.length;

          this.loadFilterValues();

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load users:',
            error
          );

          this.loading = false;

          this.snackBar.open(
            'Failed to load users.',
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );

        }

      });

  }

  // FILTER VALUES

  loadFilterValues(): void {

    this.departments = [
  ...new Set(
    this.users
      .filter(user => user.department)
      .map(user => user.department.departmentName)
  )
];

    this.designations = [
      ...new Set(
        this.users
          .map(user => user.designation)
          .filter(value => value)
      )
    ];

  }

  // FILTER USERS

  filterUsers(): void {

  const search = this.searchText
    .toLowerCase()
    .trim();

  this.filteredUsers = this.users.filter(user => {

    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phoneNumber?.includes(search);

    const matchesDepartment =
      this.selectedDepartment === 'ALL' ||
      user.department?.departmentName === this.selectedDepartment;

    const matchesDesignation =
      this.selectedDesignation === 'ALL' ||
      user.designation === this.selectedDesignation;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesDesignation
    );

  });

}

  // VIEW USER

  viewUser(user: any): void {

    this.selectedUser = user;

    this.showUserDetails = true;

  }

  // CLOSE USER DETAILS

  closeUserDetails(): void {

    this.showUserDetails = false;

    this.selectedUser = null;

  }

  // DELETE USER

  deleteUser(user: any): void {

    const dialogRef =
      this.dialog.open(
        ConfirmDialog,
        {
          width: '420px',

          data: {

            title: 'Delete User',

            message:
              `Are you sure you want to delete ${user.name || 'this user'}? This action cannot be undone.`,

            icon: 'delete'

          }

        }
      );


    dialogRef.afterClosed()
      .subscribe((confirmed) => {

        if (!confirmed) {
          return;
        }


        this.http
          .delete(
            `http://localhost:8080/admin/users/${user.userId || user.id}`,
            {
              responseType: 'text'
            }
          )
          .subscribe({

            next: () => {

              this.users =
                this.users.filter(
                  item =>
                    (item.userId || item.id) !==
                    (user.userId || user.id)
                );


              this.totalUsers =
                this.users.length;


              this.loadFilterValues();

              this.filterUsers();


              this.snackBar.open(
                'User deleted successfully.',
                'Close',
                {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                }
              );

            },

            error: (error) => {

              console.error(
                'Failed to delete user:',
                error
              );

              this.snackBar.open(
                'Failed to delete user.',
                'Close',
                {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                }
              );

            }

          });

      });

  }

  // STATISTICS

  getDepartmentCount(): number {

    return this.departments.length;

  }


  getUniqueDesignationCount(): number {

    return this.designations.length;

  }


  getRecentlyRegisteredCount(): number {

    return Math.min(
      this.users.length,
      5
    );

  }

  // CLEAR FILTERS

  clearFilters(): void {

    this.searchText = '';

    this.selectedDepartment = 'ALL';

    this.selectedDesignation = 'ALL';

    this.filterUsers();

  }

  // USER ID

  getUserId(user: any): any {

    return user.userId || user.id;

  }

}