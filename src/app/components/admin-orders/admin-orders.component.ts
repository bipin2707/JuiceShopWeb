import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() { this.loadOrders(); }


  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe(
      function(data) { this.orders = data; this.loading = false; }.bind(this),
      function() { this.loading = false; }.bind(this)
    );
  }

  accept(order: any) {
    this.orderService.acceptOrder(order.id).subscribe(function() {
      order.status = 'ACCEPTED';
    });
  }

  reject(order: any) {
    this.orderService.rejectOrder(order.id).subscribe(function() {
      order.status = 'REJECTED';
    });
  }
}
