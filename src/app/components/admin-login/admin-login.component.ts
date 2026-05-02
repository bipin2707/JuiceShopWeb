import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.adminLogin(this.email.trim(), this.password.trim()).subscribe(
      (res) => {
        this.auth.setAdmin(res.admin);
        this.router.navigate(['/admin/dashboard']);
      },
      (err) => {
        this.error = (err.error && err.error.message) || 'Invalid credentials.';
        this.loading = false;
      }
    );
  }
}

