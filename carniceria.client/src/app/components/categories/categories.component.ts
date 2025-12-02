import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories.component',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categoriesData: ICategory[] = [];
  categoryData: ICategory = { name: '' };
  isloading: boolean = false;
  errorMessage: string = '';
  openCreateCategoryModal: boolean = false;
  openDeleteCategoryModal: boolean = false;

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isloading = true;
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.categoriesService.getCategories(branchId).subscribe({
      next: (data) => {
        this.categoriesData = data;
        this.isloading = false;
        console.log('Categories loaded:', this.categoriesData);
      },
      error: (err) => {
        this.errorMessage = 'Error loading categories';
        this.isloading = false;
        console.error('Error loading categories:', err);
      }
    })
  }

  createCategory(form: NgForm): void {
    if (form.valid) {
      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
      this.categoriesService.createCategory(branchId, this.categoryData).subscribe({
        next: (data) => {
          console.log('Category created:', data);
          form.resetForm();
          this.loadCategories();
          this.toggleOpenCreateCategoryModal();
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.errorMessage = 'Error creating category';
          alert(this.errorMessage);
        }
      })
    }
    else{
      this.errorMessage = 'Please fill out the form correctly.';
      alert(this.errorMessage);
    }
  }

  deleteCategory(categoryId: number): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.categoriesService.deleteCategory(branchId, categoryId).subscribe({
      next: () => {
        console.log('Category deleted');
        this.loadCategories();
      },
      error: (err) => {
        this.errorMessage = 'Error deleting category';
        console.error('Error deleting category:', err);
      }
    })
  }

  toggleOpenCreateCategoryModal(): void {
    this.openCreateCategoryModal = !this.openCreateCategoryModal;
  }

}
