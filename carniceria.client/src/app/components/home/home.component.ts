import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { IOrder } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IProduct } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CanComponentDeactivate } from '../../services/can-deactivate.guard';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, CanComponentDeactivate{
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  orders: IOrder [] = [];
  productSearch: IProduct [] = [];
  sale: Array<IProduct & { quantity?: number }> = [];
  total: number = 0;
  change: number = 0;
  amountReceived: number = 0;
  isSearching: boolean = false;
  openModalSale: boolean = false;
  openModalSaleConfirmation: boolean = false;
  errorMessage: string = '';
  orderNumber: string = '';
  stockValidation: boolean = false;

  constructor(private branchService: BranchService, 
              private orderService: OrderService, 
              private productsService: ProductsService,
              private settingsService: SettingsService) { }

  ngOnInit(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    this.branchService.getCurrentBranchData(branchId);
    this.onGetOrders();

    this.settingsService.stockValidation$.subscribe(validation => {
      this.stockValidation = validation;
    });
  }

  canDeactivate(): boolean {
    if (this.sale.length > 0 || this.total > 0) {
      return confirm('Tienes una venta en proceso. ¿Estás seguro de que deseas salir y perder los datos ingresados?');
    }
    return true;
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
    const existingProduct = this.sale.find(p => p.productId === product.productId);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      this.sale.push({ ...product, quantity: 1 });
    }
    this.calculateTotal();
  }

  calculateTotal(): number {
    this.total = this.sale.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 1)), 0);
    return this.total;
  }

  onSelectOrder(orderId: string): void {
    this.orderNumber = orderId;
  }

  onConfirmSale(form: NgForm): void {
    if (form.valid) {
      const change = this.amountReceived - this.total;
      if (change < 0) {
        this.errorMessage = 'La cantidad recibida es insuficiente para cubrir el total de la venta.';
        alert(this.errorMessage);
        return;
      }

      if (this.total <= 0) {
        this.errorMessage = 'El total de la venta debe ser mayor a cero.';
        alert(this.errorMessage);
        return;
      }

      this.change = change;
      console.log('Sale confirmed. Change to return:', this.change);
      console.log('amountReceived:', this.amountReceived);
      
      // Actualizar stock si la validación está activada
      if (this.stockValidation) {
        const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
        this.sale.forEach(product => {
          if (product.productId && product.stock !== undefined) {
            const newStock = product.stock - (product.quantity || 1);
            this.productsService.postUpdateProductStock(branchId, product.productId, newStock).subscribe({
              next: (updatedProduct) => {
                console.log('Product stock updated after sale:', updatedProduct);
              },
              error: (err) => {
                console.error('Error updating product stock after sale:', err);
              }
            });
          }
        });
      }
      
      this.openModalSale = false;
      this.sale = [];
      this.total = 0;
      this.amountReceived = 0;
      this.errorMessage = '';
      this.orderService.clearOrderById(this.orderNumber);
      this.onGetOrders();
      this.orderNumber = '';
      this.openModalSaleConfirmation = true;
    }
  }

  onAddSameProduct(product: IProduct & { quantity?: number }): void {
    const existingProduct = this.sale.find(p => p.productId === product.productId);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    }
    this.calculateTotal();
  }

  onRemoveProduct(index: number): void {
    const product = this.sale[index];
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    } else {
      this.sale.splice(index, 1);
    }
    this.calculateTotal();
  }

}