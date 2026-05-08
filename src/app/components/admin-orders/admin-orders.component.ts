import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService, private notificationService: NotificationService) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe(
      function(data) { this.orders = data; this.loading = false; }.bind(this),
      function() { this.loading = false; }.bind(this)
    );
  }

  accept(order: any) {
    var self = this;
    this.orderService.acceptOrder(order.id).subscribe(function() {
      order.status = 'ACCEPTED';
      // Notify delivery boys
      self.notificationService.notifyOrderAccepted(order.id).subscribe(
        function() {},
        function() {}
      );
    });
  }

  reject(order: any) {
    this.orderService.rejectOrder(order.id).subscribe(function() {
      order.status = 'REJECTED';
    });
  }
}
