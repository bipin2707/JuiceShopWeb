import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  step = 1; // 1 = enter name+phone, 2 = enter OTP
  name = '';
  phone = '';
  otp = '';
  message = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  sendOtp() {
    if (!this.name.trim() || !this.phone.trim()) {
      this.error = 'Please enter your name and phone number.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.sendOtp(this.name.trim(), this.phone.trim()).subscribe(
      (res) => {
        this.message = res.message + ' OTP: ' + res.otp;
        this.step = 2;
        this.loading = false;
      },
      (err) => {
        this.error = (err.error && err.error.message) || 'Failed to send OTP.';
        this.loading = false;
      }
    );
  }

  verifyOtp() {
    if (!this.otp.trim()) {
      this.error = 'Please enter the OTP.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.verifyOtp(this.phone.trim(), this.otp.trim()).subscribe(
      (res) => {
        this.auth.setUser(res.user);
        this.router.navigate(['/menu']);
      },
      (err) => {
        this.error = (err.error && err.error.message) || 'Invalid OTP.';
        this.loading = false;
      }
    );
  }
}

