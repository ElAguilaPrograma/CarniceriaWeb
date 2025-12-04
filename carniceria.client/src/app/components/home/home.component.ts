import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IProduct } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  orders: IOrder [] = [];
  productSearch: IProduct [] = [];
  sale: IProduct [] = [];
  total: number = 0;
  isSearching: boolean = false;
  errorMessage: string = '';

  constructor(private branchService: BranchService, private orderService: OrderService, private productsService: ProductsService) { }

  ngOnInit(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.branchService.getCurrentBranchData(branchId);
    this.onGetOrders();
  }

  onGetOrders(): void {
    this.orders = this.orderService.getAllOrders();
  }

  onGetOrderDetails(orderId: string): void {
    const order = this.orderService.getOrderById(orderId);
    this.sale = order ? order.products : [];
    this.calculateTotal();
    console.log('Order details:', order);
  }

  onSearchAbarroteProducts(term: string): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    if (!term || term.trim() === '') {
      return;
    }

    this.productsService.searchAbarroteProducts(branchId, term).subscribe({
      next: (data) => {
        this.productSearch = data;
        console.log('Search results:', this.productSearch);
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.errorMessage = 'Error searching products. Please try again later.';
      }
    })
  }

  onSelectProduct(product: IProduct): void {
    this.sale.push(product);
    this.calculateTotal();
  }

  calculateTotal(): number {
    this.total = this.sale.reduce((sum, product) => sum + (product.price || 0), 0);
    return this.total;
  }
}
