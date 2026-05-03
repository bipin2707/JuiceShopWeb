import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  data: any = null;
  loading = true;
  fromDate = '';
  toDate = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    // Default: last 7 days
    var today = new Date();
    var weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    this.fromDate = this.formatDate(weekAgo);
    this.toDate = this.formatDate(today);
    this.loadDashboard();
  }

  formatDate(d: Date): string {
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return year + '-' + month + '-' + day;
  }

  loadDashboard() {
    this.loading = true;
    this.orderService.getDashboard(this.fromDate, this.toDate).subscribe(
      function(res) { this.data = res; this.loading = false; }.bind(this),
      function() { this.loading = false; }.bind(this)
    );
  }

  applyFilter() {
    this.loadDashboard();
  }

  setPreset(days: number) {
    var today = new Date();
    var from = new Date();
    from.setDate(today.getDate() - (days - 1));
    this.fromDate = this.formatDate(from);
    this.toDate = this.formatDate(today);
    this.loadDashboard();
  }

  acceptPercent(): number {
    if (!this.data || this.data.totalOrders === 0) return 0;
    return Math.round((this.data.acceptedOrders / this.data.totalOrders) * 100);
  }

  rejectPercent(): number {
    if (!this.data || this.data.totalOrders === 0) return 0;
    return Math.round((this.data.rejectedOrders / this.data.totalOrders) * 100);
  }
}
