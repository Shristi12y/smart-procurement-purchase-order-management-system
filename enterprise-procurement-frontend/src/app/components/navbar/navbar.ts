import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  userName = localStorage.getItem('name');
  userRole = localStorage.getItem('role');

  constructor(private router: Router) {}

  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);
  }
}