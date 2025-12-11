import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../services/branch.service';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { IProduct } from '../../models/products.model';
import { ProductsService } from '../../services/products.service';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CanComponentDeactivate } from '../../services/can-deactivate.guard';
import { SettingsService } from '../../services/settings.service';
import { SaleService } from '../../services/sale.service';
import { SaleRequest } from '../../models/sale.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, CanComponentDeactivate{
  nameBranch: string = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || '{}').name : 'Sucursal Desconocida';
  orders: Order [] = [];
  orderSelected: Order | null = null;
  productSearch: IProduct [] = [];
  sale: Array<IProduct & { quantity?: number }> = [];
  total: number = 0;
  totalAbsolute: number = this.total;
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
              private settingsService: SettingsService,
              private saleService: SaleService) { }

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
    const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
    if (!branchId) {
      this.errorMessage = 'Branch ID is not available.';
      alert(this.errorMessage);
      return;
    }

    this.orderService.getOrdersWithDetails(branchId).subscribe({
      next : (data) => {
        this.orders = data;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.errorMessage = 'Error loading orders. Please try again later.';
        alert(this.errorMessage);
      }
    })
  }

  onGetOrderDetails(orderId: number): void {
    this.orderSelected = this.orders.find(order => order.orderId === orderId) || null;
    console.log('Order selected:', this.orderSelected);
    this.calculateTotal();
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
    const productsTotal = this.sale.reduce((sum, product) => sum + ((product.price || 0) * (product.quantity || 1)), 0);
    const orderTotal = this.orderSelected ? this.orderSelected.total : 0;
    this.total = productsTotal + orderTotal;
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

      if (this.sale.length === 0 && !this.orderSelected) {
        this.errorMessage = 'Debe agregar al menos un producto o seleccionar una orden.';
        alert(this.errorMessage);
        return;
      }

      const branchId = JSON.parse(localStorage.getItem('selectedBranch') || '{}').branchId;
      if (!branchId) {
        alert('No branch selected');
        return;
      }

      // Construir los detalles de la venta
      const saleDetails: Array<{ ProductId: number; OrderId?: number; WeightOrQuantity: number }> = [];

      // Agregar productos de abarrote (sale array)
      this.sale.forEach(product => {
        if (product.productId) {
          for (let i = 0; i < (product.quantity || 1); i++) {
            saleDetails.push({
              ProductId: product.productId,
              WeightOrQuantity: 1 // Cantidad de 1 para cada producto de abarrote
              // OrderId se omite para productos de abarrote
            });
          }
        }
      });

      // Agregar productos de la orden de carnicería si existe
      if (this.orderSelected) {
        this.orderSelected.details.forEach(detail => {
          saleDetails.push({
            ProductId: detail.productId,
            OrderId: this.orderSelected!.orderId,
            WeightOrQuantity: detail.weightOrQuantity // Peso en kg de la carne
          });
        });
      }

      const saleRequest: SaleRequest = {
        SaleDetails: saleDetails
      };

      this.change = change;
      console.log('Sale request:', saleRequest);
      console.log('Total:', this.total);

      // Crear la venta
      this.saleService.createSale(branchId, saleRequest).subscribe({
        next: (response) => {
          console.log('Sale created successfully:', response);

          if (this.orderSelected) {
            // Marcar la orden como completa si existe
            this.orderService.completeOrder(this.orderSelected?.orderId).subscribe({
              next: (res) => {
                console.log('Order completed successfully:', res);
                this.onGetOrders();
              },
              error: (err) => {
                console.error('Error completing order:', err);
              }
            });
          }
          
          // Actualizar stock si la validación está activada
          if (this.stockValidation) {
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
          this.orderSelected = null;
          this.onGetOrders();
          this.orderNumber = '';
          this.openModalSaleConfirmation = true;
        },
        error: (err) => {
          console.error('Error creating sale:', err);
          this.errorMessage = 'Error al crear la venta. Por favor intente nuevamente.';
          alert(this.errorMessage);
        }
      });
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