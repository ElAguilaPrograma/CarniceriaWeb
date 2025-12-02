import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BranchService } from '../../services/branch.service';
import { IBranch } from '../../models/branch.model';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../dialog/confirm-delete-dialog/confirm-delete-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branches',
  standalone: false,
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {
  branches: IBranch[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  branchData: IBranch = {
    name: '',
    address: '',
    phone: ''
  };
  noBranches: boolean = false;
  openCreateBranchModal: boolean = false;
  openUpdateBranchModal: boolean = false;
  selectedBranch: IBranch = { name: '', address: '', phone: '' };

  constructor(
    private router: Router,
    private branchService: BranchService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadBranches();
  }

  showIdFromCurrenteEdintingBranch(): void {
    if (this.openUpdateBranchModal){
      console.log('Current editing branch ID:', this.selectedBranch.branchId);
    }
  }

  loadBranches(): void {
    this.isLoading = true;
    this.branchService.show().subscribe({
      next: (data) => {
        this.branches = data;
        this.isLoading = false;
        console.log('Branches loaded:', this.branches);
      },
      error: (err) => {
        this.errorMessage = 'Error loading branches';
        this.isLoading = false;
        console.error('Error loading branches:', err);
      }
    });
  }

  createBranch(form: NgForm): void {
    if (form.valid) {
      this.branchService.create(this.branchData).subscribe({
        next: (res) => {
          console.log('Branch created:', res);
          this.loadBranches();
          this.openCreateBranchModal = false;
          form.resetForm(); // Reset form after successful submission
        },
        error: (err) => {
          this.errorMessage = 'Error creating branch';
          console.error('Error creating branch:', err);
        }
      });
    }
  }

  updateBranch(form: NgForm): void {
    if (form.valid && this.selectedBranch.branchId) {
      this.branchService.update(this.selectedBranch, this.selectedBranch.branchId).subscribe({
        next: (res) => {
          console.log('Branch updated:', res);
          this.loadBranches();
          this.openUpdateBranchModal = false;
          form.resetForm(); // Reset form after successful submission
        },
        error: (err) => {
          this.errorMessage = 'Error updating branch';
          console.error('Error updating branch:', err);
        }
      })
    };
  }

  deleteBranch(branchId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '350px',
      disableClose: true,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.branchService.delete(branchId).subscribe({
          next: (res) => {
            console.log('Branch deleted:', res);
            this.loadBranches();
          },
          error: (err) => {
            this.errorMessage = 'Error deleting branch';
            console.error('Error deleting branch:', err);
          }
        })
      }
    });
  }

  setBranchSelectedInLocalStorage(branch: IBranch): void {
    this.selectedBranch = branch;
    console.log("Sucursal seleccionada: ", this.selectedBranch);

    if (localStorage.getItem('selectedBranch') !== null) {
      localStorage.removeItem('selectedBranch');
      localStorage.setItem('selectedBranch', JSON.stringify({ branchId: this.selectedBranch.branchId, name: this.selectedBranch.name }));
    }
    else {
      localStorage.setItem('selectedBranch', JSON.stringify({ branchId: this.selectedBranch.branchId, name: this.selectedBranch.name }));
    }
    
    // Actualizar el nombre en el servicio para que se refleje en el header
    this.branchService.updateBranchName(this.selectedBranch.name || 'Bienvenido');
  }

  toggleCreateBranchModal(): void {
    this.openCreateBranchModal = !this.openCreateBranchModal;
  }

  toggleUpdateBranchModal(branch: IBranch): void {
    this.openUpdateBranchModal = !this.openUpdateBranchModal;
    this.selectedBranch = { ...branch }; // Clone the branch data to avoid direct mutation
  }

  navigateToSelectedBranchHome(): void {
    this.router.navigate(['/home']);
  }

}
