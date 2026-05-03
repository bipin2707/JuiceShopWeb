import { Injectable } from '@angular/core';
import { Juice } from '../models/juice.model';

export interface CartItem {
  juice: Juice;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(juice: Juice) {
    var existing = this.items.find(function(i) { return i.juice.id === juice.id; });
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ juice: juice, quantity: 1 });
    }
  }

  removeFromCart(juiceId: string) {
    this.items = this.items.filter(function(i) { return i.juice.id !== juiceId; });
  }

  updateQuantity(juiceId: string, qty: number) {
    var item = this.items.find(function(i) { return i.juice.id === juiceId; });
    if (item) {
      if (qty <= 0) {
        this.removeFromCart(juiceId);
      } else {
        item.quantity = qty;
      }
    }
  }

  getTotal(): number {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
      total += this.items[i].juice.price * this.items[i].quantity;
    }
    return total;
  }

  getItemCount(): number {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
      count += this.items[i].quantity;
    }
    return count;
  }

  clear() {
    this.items = [];
  }
}
