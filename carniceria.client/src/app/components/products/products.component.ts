import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { IProduct } from '../../models/products.model';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { ICategory } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { IUnit } from '../../models/unit.model';
import { UnitsService } from '../../services/units.service';
import { GenerateCodeService } from '../../services/generateCode.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  products: IProduct[] = [];
  categories: ICategory[] = [];
  units: IUnit[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  productsData: IProduct = {
    code: "", name: "", price: 0, stock: 0, active: false
  };
  noProducts: boolean = false;
  selectedProduct: IProduct = { code: "", name: "", price: 0, stock: 0, active: false };
  openCreateProductModal: boolean = false;
  openUpdateProductModal: boolean = false;
  openDeleteProductModal: boolean = false;
  openSelectTypeProductModal: boolean = false;
  isGrocery: boolean = true;
  categoriesData: ICategory = {
    name: ""
  };
  unitsData: IUnit = {
    name: "",
    abbreviation: ""
  };

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private generateCodeService: GenerateCodeService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadUnits();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts(JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        console.log('Products loaded:', this.products);
      },
      error: (err) => {
        this.errorMessage = 'Error loading products';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  // Crear producto con código generado automáticamente si no se proporciona uno
  createProduct(form: NgForm): void {
    console.log('createProduct called', { valid: form.valid, productsData: this.productsData });
    
    if (form.valid) {
      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
      console.log('Form is valid, branchId:', branchId);
      
      if (!this.productsData.code || this.productsData.code.trim() === '') {
        console.log('Generating code for carniceria product...');
        this.generateCodeService.generateCode(branchId).subscribe({
          next: (code) => {
            console.log('Code generated:', code);
            this.productsData.code = code;
            this.saveProduct(branchId, form);
          },
          error: (err) => {
            this.errorMessage = 'Error generating product code';
            console.error('Error generating product code:', err);
          }
        });
      } else {
        console.log('Using code:', this.productsData.code);
        this.productsService.checkProductCodeExists(branchId, this.productsData.code).subscribe({
          next: (exists) => {
            if (exists) {
              this.errorMessage = 'Product code already exists';
              alert('Product code already exists: ' + this.productsData.code);
              console.log('Product code already exists. Please use a different code.');
            }
            else {
              this.saveProduct(branchId, form);
            }
          },
          error: (err) => {
            this.errorMessage = 'Error checking product code';
            console.error('Error checking product code:', err);
          }
        });
      }
    } else {
      console.log('Form is invalid', form.errors);
    }
  }

  // Guardar el producto 
  private saveProduct(branchId: number, form: NgForm): void {
    this.productsService.createProduct(branchId, this.productsData).subscribe({
      next: (data) => {
        console.log('Product created:', data);
          this.openCreateProductModal = false;
          form.resetForm();
          this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = 'Error creating product';
        console.error('Error creating product:', err);
      }
    });
  }

  updateProduct(form: NgForm): void {
    if (form.valid) {
      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
      this.productsService.updateProduct(branchId, this.selectedProduct.productId!, this.selectedProduct).subscribe({
        next: (data) => {
          console.log('Product updated:', data);
          this.openUpdateProductModal = false;
          form.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = 'Error updating product';
          console.error('Error updating product:', err);
        }
      });
    }
  }

  deleteProduct(productId: number): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.productsService.deleteProduct(branchId, productId).subscribe({
      next: () => {
        console.log('Product deleted:', productId);
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = 'Error deleting product';
        console.error('Error deleting product:', err);
      }
    })
  }

  toggleSelectTypeProductModal(): void {
    this.openSelectTypeProductModal = !this.openSelectTypeProductModal;
  }

  toggleCreateProductModal(): void {
    this.openCreateProductModal = !this.openCreateProductModal;
    if (this.openCreateProductModal) {
      this.resetProductData();
    }
  }

  toggleDeleteProductModal(): void {
    this.openDeleteProductModal = !this.openDeleteProductModal;
  }

  private resetProductData(): void {
    this.productsData = {
      code: "",
      name: "",
      price: 0,
      stock: 0,
      active: false
    };
  }

  loadCategories(): void {
    this.categoriesService.getCategories(JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId).subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadUnits(): void {
    this.unitsService.getUnits(JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId).subscribe({
      next: (data) => {
        this.units = data;
        console.log('Units loaded:', this.units);
      },
      error: (err) => {
        console.error('Error loading units:', err);
      }
    })
  }

  loadSearchProducts(term: string): void {
    if (!term || term.trim() === '') {
      this.loadProducts();
      return;
    }

    this.isLoading = true;
    this.productsService.searchProducts(JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId, term).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        console.log('Search products loaded:', data);
      },
      error: (err) => {
        this.errorMessage = 'Error searching products';
        this.isLoading = false;
        console.error('Error searching products:', err);
      }
    })
  }

  currentProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  generateCode(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.generateCodeService.generateCode(branchId).subscribe({
      next: (code) => {
        console.log('Code generated:', code);
        this.selectedProduct.code = code;
      },
      error: (err) => {
        this.errorMessage = 'Error generating product code';
        console.error('Error generating product code:', err);
      }
    })
  }

}
