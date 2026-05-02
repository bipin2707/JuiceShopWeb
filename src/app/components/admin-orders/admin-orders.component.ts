import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe(
      data => { this.orders = data; this.loading = false; },
      () => { this.loading = false; }
    );
  }

  accept(order: Order) {
    this.orderService.acceptOrder(order.id).subscribe(() => {
      order.status = 'ACCEPTED';
    });
  }

  reject(order: Order) {
    this.orderService.rejectOrder(order.id).subscribe(() => {
      order.status = 'REJECTED';
    });
  }
}
