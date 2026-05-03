import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(public cart: CartService, private router: Router) {}

  get items(): CartItem[] {
    return this.cart.getItems();
  }

  increment(juiceId: string) {
    var item = this.items.find(function(i) { return i.juice.id === juiceId; });
    if (item) {
      this.cart.updateQuantity(juiceId, item.quantity + 1);
    }
  }

  decrement(juiceId: string) {
    var item = this.items.find(function(i) { return i.juice.id === juiceId; });
    if (item && item.quantity > 1) {
      this.cart.updateQuantity(juiceId, item.quantity - 1);
    }
  }

  remove(juiceId: string) {
    this.cart.removeFromCart(juiceId);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
