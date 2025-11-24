import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BranchService } from '../../services/branch.service';
import { IBranch } from '../../models/branch.model';

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

  constructor(
    private authService: AuthService,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {
    this.loadBranches();
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

  createBranch(): void {
    // Implementation for creating a branch goes here
  }
}
