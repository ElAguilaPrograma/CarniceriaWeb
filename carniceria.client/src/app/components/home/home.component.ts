import { Component } from '@angular/core';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  constructor(private branchService: BranchService) { }



}
