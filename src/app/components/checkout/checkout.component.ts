import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  customerName = '';
  phone = '';
  location = '';
  error = '';
  phoneError = '';
  loading = false;
  orderPlaced = false;
  orderDate = '';

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  get items(): CartItem[] {
    return this.cart.getItems();
  }

  validatePhone(): boolean {
    var cleaned = this.phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      this.phoneError = 'Phone number must be exactly 10 digits.';
      return false;
    }
    this.phoneError = '';
    return true;
  }

  placeOrder() {
    this.error = '';
    this.phoneError = '';

    if (!this.customerName.trim()) {
      this.error = 'Please enter your name.';
      return;
    }
    if (!this.validatePhone()) {
      return;
    }
    if (this.items.length === 0) {
      this.error = 'Your cart is empty.';
      return;
    }

    this.loading = true;
    var orderItems = [];
    for (var i = 0; i < this.items.length; i++) {
      orderItems.push({
        juiceId: this.items[i].juice.id,
        quantity: this.items[i].quantity
      });
    }

    var cleanPhone = this.phone.replace(/\D/g, '');
    var self = this;
    this.orderService.placeOrder(this.customerName.trim(), cleanPhone, this.location.trim(), orderItems).subscribe(
      function(res) {
        self.orderPlaced = true;
        self.orderDate = new Date().toLocaleString();
        self.loading = false;
      },
      function(err) {
        self.error = (err.error && err.error.message) || 'Failed to place order.';
        self.loading = false;
      }
    );
  }

  printInvoice() {
    window.print();
  }

  newOrder() {
    this.cart.clear();
    this.router.navigate(['/menu']);
  }
}
