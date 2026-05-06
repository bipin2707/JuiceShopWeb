import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryAuthService } from '../../services/delivery-auth.service';

@Component({
  selector: 'app-delivery-login',
  templateUrl: './delivery-login.component.html',
  styleUrls: ['./delivery-login.component.css']
})
export class DeliveryLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private deliveryAuth: DeliveryAuthService,
    private router: Router
  ) {
    // If already logged in, redirect to delivery dashboard
    if (this.deliveryAuth.isLoggedIn()) {
      this.router.navigate(['/delivery/dashboard']);
    }
  }

  login() {
    this.error = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Email and password are required.';
      return;
    }

    this.loading = true;
    var self = this;
    this.deliveryAuth.login(this.email.trim(), this.password.trim()).subscribe(
      function(res: any) {
        self.deliveryAuth.setDeliveryBoy(res.deliveryBoy);
        self.loading = false;
        self.router.navigate(['/delivery/dashboard']);
      },
      function(err: any) {
        self.error = (err.error && err.error.message) || 'Login failed.';
        self.loading = false;
      }
    );
  }
}
