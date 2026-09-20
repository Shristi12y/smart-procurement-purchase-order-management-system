
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SupplierSidebar } from '../supplier-sidebar/supplier-sidebar';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-supplier-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    SupplierSidebar
  ],
  templateUrl: './supplier-layout.html',
  styleUrl: './supplier-layout.scss'
})
export class SupplierLayout {

}

