import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-sidebar',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],

  templateUrl: './admin-sidebar.html',

  styleUrl: './admin-sidebar.scss'
})
export class AdminSidebar {
  downloadPaymentExcel(): void {
  window.open(
    'http://localhost:8080/payments/export/excel',
    '_blank'
  );
}

downloadPaymentPdf(): void {
  window.open(
    'http://localhost:8080/payments/export/pdf',
    '_blank'
  );
}
}