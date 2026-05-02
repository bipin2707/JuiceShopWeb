import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  data: any = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe(
      (res) => { this.data = res; this.loading = false; },
      () => { this.loading = false; }
    );
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
