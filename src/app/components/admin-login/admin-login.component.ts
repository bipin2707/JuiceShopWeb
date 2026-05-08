import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router, private notificationService: NotificationService) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    var self = this;
    this.auth.adminLogin(this.email.trim(), this.password.trim()).subscribe(
      function(res: any) {
        self.auth.setAdmin(res.admin);
        // Register FCM token for admin
        self.notificationService.requestPermission().then(function(token) {
          self.notificationService.saveTokenForPhone(res.admin.email, token, 'admin').subscribe(
            function() {},
            function() {}
          );
        }).catch(function() {});
        self.router.navigate(['/admin/dashboard']);
      },
      function(err: any) {
        self.error = (err.error && err.error.message) || 'Invalid credentials.';
        self.loading = false;
      }
    );
  }
}

