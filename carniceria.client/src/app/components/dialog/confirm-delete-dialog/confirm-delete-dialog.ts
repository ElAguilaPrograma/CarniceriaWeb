import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: false,
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.css',
})
export class ConfirmDeleteDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialog>) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
