import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  phone = '';
  phoneError = '';
  orders: any[] = [];
  loading = false;
  searched = false;

  constructor(private orderService: OrderService) {
    // Try to restore phone from localStorage
    var savedPhone = localStorage.getItem('juice_customer_phone');
    if (savedPhone) {
      this.phone = savedPhone;
      this.fetchOrders();
    }
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

  fetchOrders() {
    if (!this.validatePhone()) return;

    var cleanPhone = this.phone.replace(/\D/g, '');
    this.loading = true;
    this.searched = true;

    // Save phone for convenience
    localStorage.setItem('juice_customer_phone', cleanPhone);

    var self = this;
    this.orderService.getMyOrders(cleanPhone).subscribe(
      function(data: any) {
        self.orders = data;
        self.loading = false;
      },
      function() {
        self.orders = [];
        self.loading = false;
      }
    );
  }

  getStatusClass(status: string): string {
    if (status === 'PENDING') return 'status-pending';
    if (status === 'ACCEPTED') return 'status-accepted';
    if (status === 'REJECTED') return 'status-rejected';
    return '';
  }

  getStatusIcon(status: string): string {
    if (status === 'PENDING') return '\u23F3';
    if (status === 'ACCEPTED') return '\u2705';
    if (status === 'REJECTED') return '\u274C';
    return '';
  }

  getProgressWidth(status: string): number {
    if (status === 'PENDING') return 33;
    if (status === 'ACCEPTED') return 66;
    if (status === 'REJECTED') return 100;
    return 0;
  }

  getProgressColor(status: string): string {
    if (status === 'PENDING') return '#f57f17';
    if (status === 'ACCEPTED') return '#2e7d32';
    if (status === 'REJECTED') return '#c62828';
    return '#ccc';
  }
}
