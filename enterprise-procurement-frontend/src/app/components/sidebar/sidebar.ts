import { Component } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../confirm-dialog/confirm-dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sidebar',

  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],

  templateUrl: './sidebar.html',

  styleUrl: './sidebar.scss'
})

export class Sidebar {

  userRole: string | null =
    localStorage.getItem('role');

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

 downloadExcel(): void {

const dialogRef = this.dialog.open(
ConfirmDialog,
{
width: '420px',

  data: {
          title: 'Download Excel Report',
          message:
          'Do you want to download the Payment Excel report?',
          icon: 'table_view',
          confirmText: 'Download',
          cancelText: 'Cancel'
        }
}

);

dialogRef.afterClosed().subscribe(
(confirmed) => {

  if (!confirmed) {
    return;
  }


  this.http.get(
    'http://localhost:8080/payments/export/excel',
    {
      responseType: 'blob'
    }
  ).subscribe({

    next: (response) => {

      const blob = new Blob(
        [response],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'payment_report.xlsx';

      link.click();

      window.URL.revokeObjectURL(url);


      this.snackBar.open(
        'Payment Excel report downloaded successfully!',
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
        'Failed to download Excel report:',
        error
      );

      this.snackBar.open(
        'Failed to download Excel report.',
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
);
 }


  downloadPdf(): void {

const dialogRef = this.dialog.open(
ConfirmDialog,
{
width: '420px',

  data: {
          title: 'Download PDF Report',
          message:
          'Do you want to download the Payment PDF report?',
          icon: 'picture_as_pdf',
          confirmText: 'Download',
          cancelText: 'Cancel'
        }
}

);

dialogRef.afterClosed().subscribe(
(confirmed) => {

  if (!confirmed) {
    return;
  }


  this.http.get(
    'http://localhost:8080/payments/export/pdf',
    {
      responseType: 'blob'
    }
  ).subscribe({

    next: (response) => {

      const blob = new Blob(
        [response],
        {
          type: 'application/pdf'
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;

      link.download =
        'payment_report.pdf';

      link.click();

      window.URL.revokeObjectURL(url);


      this.snackBar.open(
        'Payment PDF report downloaded successfully!',
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
        'Failed to download PDF report:',
        error
      );

      this.snackBar.open(
        'Failed to download PDF report.',
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

);

}

downloadPurchaseRequestsExcel(): void {

  const userId = localStorage.getItem('userId');

  if (!userId) {

    this.snackBar.open(
      'User ID not found. Please login again.',
      'Close',
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );

    return;
  }


  const dialogRef = this.dialog.open(
    ConfirmDialog,
    {
      width: '420px',

      data: {
              title: 'Download Purchase Requests',
              message:'Do you want to download your purchase requests as an Excel file?',
              icon: 'table_view',
              confirmText: 'Download',
              cancelText: 'Cancel'
}
    }
  );


  dialogRef.afterClosed().subscribe(
    (confirmed) => {

      if (!confirmed) {
        return;
      }


      this.http
        .get<any[]>(
          `http://localhost:8080/purchaseOrders/user/${userId}`
        )
        .subscribe({

          next: (orders) => {

            if (!orders || orders.length === 0) {

              this.snackBar.open(
                'No purchase requests available to download.',
                'Close',
                {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top'
                }
              );

              return;
            }


            const excelData = orders.map(order => ({

              'Purchase Order ID':
                order.purchaseOrderId ?? '',

              'Product Name':
                order.product?.name ?? '',

              'Supplier Name':
                order.supplier?.name ?? '',

              'Quantity':
                order.quantity ?? 0,

              'Price Per Product':
                order.product?.pricePerProduct ?? 0,

              'Total Amount':
                order.totalAmount ?? 0,

              'Order Date':
                order.orderDate ?? '',

              'Status':
                order.status ?? ''

            }));


            const worksheet =
              XLSX.utils.json_to_sheet(excelData);


            /*
             * Automatically calculate column widths
             * based on header names and cell content.
             */

            const columnWidths =
              Object.keys(excelData[0]).map(header => {

                const maxLength =
                  Math.max(

                    header.length,

                    ...excelData.map(row =>
                      String(
                        row[
                          header as keyof typeof row
                        ] ?? ''
                      ).length
                    )

                  );

                return {

                  wch: maxLength + 3

                };

              });


            worksheet['!cols'] =
              columnWidths;


            /*
             * Format currency columns
             */

            const range =
              XLSX.utils.decode_range(
                worksheet['!ref'] || 'A1'
              );


            for (
              let row = 1;
              row <= range.e.r;
              row++
            ) {

              const priceCell =
                worksheet[
                  XLSX.utils.encode_cell({
                    r: row,
                    c: 4
                  })
                ];


              const totalCell =
                worksheet[
                  XLSX.utils.encode_cell({
                    r: row,
                    c: 5
                  })
                ];


              if (priceCell) {

                priceCell.z =
                  '₹#,##0.00';

              }


              if (totalCell) {

                totalCell.z =
                  '₹#,##0.00';

              }

            }


            const workbook =
              XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
              workbook,
              worksheet,
              'Purchase Requests'
            );


            XLSX.writeFile(
              workbook,
              'my-purchase-requests.xlsx'
            );


            this.snackBar.open(
              'Purchase requests Excel file downloaded successfully!',
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
              'Failed to download purchase requests:',
              error
            );


            this.snackBar.open(
              'Failed to download purchase requests.',
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

  );

}

}