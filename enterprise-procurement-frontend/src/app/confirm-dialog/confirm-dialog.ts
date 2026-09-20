import { Component, Inject } from '@angular/core';
import {
MAT_DIALOG_DATA,
MatDialogModule,
MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
selector: 'app-confirm-dialog',
standalone: true,
imports: [
MatDialogModule,
MatButtonModule,
MatIconModule
],
templateUrl: './confirm-dialog.html',
styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {

constructor(
public dialogRef: MatDialogRef<ConfirmDialog>,


@Inject(MAT_DIALOG_DATA)
public data: {
  title: string;
  message: string;
  icon: string;
  confirmText?: string;
  cancelText?: string;
}

) {}

cancel(): void {
this.dialogRef.close(false);
}

confirm(): void {
this.dialogRef.close(true);
}

}
