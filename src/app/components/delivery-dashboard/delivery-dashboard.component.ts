import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryAuthService } from '../../services/delivery-auth.service';

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent implements OnInit {
  deliveryBoy: any = null;
  dashboard: any = null;
  loading = true;
  error = '';

  constructor(
    private deliveryAuth: DeliveryAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.deliveryBoy = this.deliveryAuth.getDeliveryBoy();
    if (!this.deliveryBoy) {
      this.router.navigate(['/delivery-login']);
      return;
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    var self = this;
    this.deliveryAuth.getDashboard(this.deliveryBoy.id).subscribe(
      function(data: any) {
        self.dashboard = data;
        self.loading = false;
      },
      function(err: any) {
        self.error = 'Failed to load dashboard.';
        self.loading = false;
      }
    );
  }
}
