import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { NgForm } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { IOrder } from '../../models/order.model';
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
  orders: IOrder[] = [];
  productsSelected: Array<IProduct & { weight?: number; isCalculating?: boolean }> = [];
  showNewOrderTable: boolean = false;
  isSearching: boolean = false;
  errorMessage: string = '';
  stockValidation: boolean = false;

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
    this.productsSelected.push({
      ...product,
      weight: undefined,
      isCalculating: false
    });
    console.log('Product selected:', product);
  }

  onWeightReceived(form: NgForm, index: number): void {
    if (form.valid) {
      const weight = parseFloat(form.value.weight);
      if (isNaN(weight) || weight <= 0) {
        this.errorMessage = 'Por favor ingresa un peso válido.';
        alert(this.errorMessage);
        return;
      }

      const product = this.productsSelected[index];
      product.weight = weight;
      product.isCalculating = true;

      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
      
      this.productsService.getMeatPrice(product.productId!, branchId, weight).subscribe({
        next: (data) => {
          if (this.stockValidation && weight > product.stock!) {
            this.errorMessage = `El peso ingresado (${weight} kg) excede el stock disponible (${product.stock} kg). Por favor ingresa un peso válido.`;
            alert(this.errorMessage);
            product.isCalculating = false;
            this.productsSelected.splice(index, 1);
            return;
          }
          this.productsSelected[index].price = data.price;
          this.productsSelected[index].isCalculating = false;
          console.log('Price updated for product:', this.productsSelected[index]);
        },
        error: (err) => {
          console.error('Error fetching meat price:', err);
          this.errorMessage = 'Error al obtener el precio. Por favor intenta de nuevo.';
          this.productsSelected[index].isCalculating = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor ingresa un peso válido.';
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

  onSendOrder(): void {
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    const totalAmount = this.onCalculateTotal();
    
    // Actualizar el stock de cada producto solo si la validación está activada
    if (this.stockValidation) {
      this.productsSelected.forEach(product => {
        if (product.weight && product.productId && product.stock !== undefined) {
          const newStock = product.stock - product.weight;
          this.productsService.postUpdateProductStock(branchId, product.productId, newStock).subscribe({
            next: (updatedProduct) => {
              console.log('Product stock updated after sending order:', updatedProduct);
            },
            error: (err) => {
              console.error('Error updating product stock after sending order:', err);
              this.errorMessage = `Error al actualizar el stock del producto ${product.name}`;
            }
          });
        }
      });
    }

    const orderId = this.orderService.saveOrder(this.productsSelected, totalAmount);
    console.log(`Orden guardada: ${orderId}`);
    this.loadOrders(); 
  }

  loadOrders(): void {
    this.orders = this.orderService.getAllOrders();
    console.log('Órdenes cargadas:', this.orders);
  }

}
