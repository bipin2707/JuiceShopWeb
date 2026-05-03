import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../../services/juice.service';
import { CartService } from '../../services/cart.service';
import { Juice } from '../../models/juice.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  juices: Juice[] = [];
  loading = true;

  constructor(
    private juiceService: JuiceService,
    public cart: CartService
  ) {}

  ngOnInit() { this.loadJuices(); }

  loadJuices() {
    this.loading = true;
    this.juiceService.getAvailable().subscribe(
      function(data) { this.juices = data; this.loading = false; }.bind(this),
      function() { this.loading = false; }.bind(this)
    );
  }

  getQty(juiceId: string): number {
    var items = this.cart.getItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].juice.id === juiceId) return items[i].quantity;
    }
    return 0;
  }

  addToCart(juice: Juice) {
    this.cart.addToCart(juice);
  }

  increment(juice: Juice) {
    this.cart.addToCart(juice);
  }

  decrement(juiceId: string) {
    var qty = this.getQty(juiceId);
    if (qty <= 1) {
      this.cart.removeFromCart(juiceId);
    } else {
      this.cart.updateQuantity(juiceId, qty - 1);
    }
  }
}
