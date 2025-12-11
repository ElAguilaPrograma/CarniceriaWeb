import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { NgForm } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from '../../services/can-deactivate.guard';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-carnage.component',
  standalone: false,
  templateUrl: './carnage.component.html',
  styleUrl: './carnage.component.css',
})
export class CarnageComponent implements OnInit, CanComponentDeactivate {
  productsCarnage: IProduct[] = [];
  orders: Order[] = [];
  productsSelected: Array<IProduct & { weight?: number; isCalculating?: boolean }> = [];
  orderProductos: IProduct[] = [];
  showNewOrderTable: boolean = false;
  isSearching: boolean = false;
  errorMessage: string = '';
  stockValidation: boolean = false;
  private generatedOrderNumbers: Set<string> = new Set();

  constructor(private productsService: ProductsService, private orderService: OrderService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.loadOrders();
    
    this.settingsService.stockValidation$.subscribe(validation => {
      this.stockValidation = validation;
    });
  }

  canDeactivate(): boolean {
    if (this.productsSelected.length > 0) {
      return confirm('Tienes una orden en proceso. ¿Estás seguro de que deseas salir y perder los datos ingresados?');
    }
    return true;
  }

  onSearchMeats(term: string): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    if (!term || term.trim() === '') {
      return;
    }

    this.productsService.searchMeats(branchId, term).subscribe({
      next: (data) => {
        this.productsCarnage = data;
        console.log('Search results:', this.productsCarnage);
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.errorMessage = 'Error searching products. Please try again later.';
      }
    })
  }

  onSelectProduct(product: IProduct): void {
    this.productsSelected.push({ ...product, weight: undefined, isCalculating: false });
    console.log("Product selected:", product);
  }

  onWeightReceived(form: NgForm, index: number): void {
    if (form.valid) {
      const weight = parseFloat(form.value.weight);
      if (isNaN(weight) || weight <= 0) {
        this.errorMessage = 'Please enter a valid weight.';
        alert(this.errorMessage);
        return;
      }

      const product = this.productsSelected[index];
      product.weight = weight;
      product.isCalculating = true;

      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;

      this.productsService.getMeatPrice(product.productId!, branchId, weight).subscribe({
        next: (data) => {
          if (this.stockValidation && weight > product.stock) {
            this.errorMessage = `Insufficient stock for ${product.name}. Available stock: ${product.stock} kg.`;
            alert(this.errorMessage);
            product.isCalculating = false;
            this.productsSelected.splice(index, 1);
            return;
          }
          this.productsSelected[index].price = data.price;
          this.productsSelected[index].isCalculating = false;
          console.log(`Price calculated for ${product.name}:`, data.price);
        },
        error: (err) => {
          console.error('Error calculating price:', err);
          this.errorMessage = 'Error calculating price. Please try again later.';
          product.isCalculating = false;
        }
      })
    }
    else {
      this.errorMessage = 'Please enter a valid weight.';
      alert(this.errorMessage);
    }
  }

  onCalculateTotal(): number {
    return this.productsSelected.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  onCleanOrder(): void {
    this.productsSelected.length = 0;
    console.log('Order cleaned, selected products cleared.');
  }

  onCancelOrder(): void {
    this.productsSelected.length = 0;
  }

  loadOrders(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    if (!branchId) {
      console.error('No branch selected');
      return;
    }

    this.orderService.getOrdersWithDetails(branchId).subscribe({
      next: (data) => {
        this.orders = data;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.errorMessage = 'Error loading orders. Please try again later.';
      }
    });
  }

  private generateUniqueOrderNumber(): string {
    let orderNumber: string;
    do {
      orderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    } while (this.generatedOrderNumbers.has(orderNumber));
    
    this.generatedOrderNumbers.add(orderNumber);
    return orderNumber;
  }

  createOrder(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    if (!branchId) {
      alert('No branch selected');
      return;
    }

    if (this.productsSelected.length === 0) {
      alert('No products selected');
      return;
    }

    // Verificar que todos los productos tengan peso y precio calculado
    const allProductsReady = this.productsSelected.every(p => p.weight !== undefined && p.price !== undefined && !p.isCalculating);
    if (!allProductsReady) {
      alert('Please wait for all products to be processed');
      return;
    }

    const orderName = `Orden ${this.generateUniqueOrderNumber()}`;
    
    const orderRequest = {
      branchId: branchId,
      name: orderName,
      details: this.productsSelected.map(p => ({
        productId: p.productId!,
        weightOrQuantity: p.weight!
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        alert(`Orden creada exitosamente: ${orderName}`);
        this.onCleanOrder();
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error creating order:', err);
        this.errorMessage = 'Error creating order. Please try again later.';
        alert(this.errorMessage);
      }
    });
  }

}
