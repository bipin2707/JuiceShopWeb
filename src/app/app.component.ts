import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DeliveryAuthService } from './services/delivery-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    public deliveryAuth: DeliveryAuthService,
    public router: Router
  ) {}

  isLoginPage(): boolean {
    var url = this.router.url;
    return url === '/admin-login' || url === '/delivery-login';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin-login']);
  }

  deliveryLogout() {
    this.deliveryAuth.logout();
    this.router.navigate(['/delivery-login']);
  }
}
