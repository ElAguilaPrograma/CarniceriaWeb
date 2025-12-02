import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  constructor(private branchService: BranchService) { }

  ngOnInit(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.branchService.getCurrentBranchData(branchId);
  }
}
