import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.apiUrl + '/Auth';

  constructor(private http: HttpClient) {}

  // User auth
  sendOtp(name: string, phone: string): Observable<any> {
    return this.http.post(this.url + '/user/send-otp', { name, phone });
  }

  verifyOtp(phone: string, otp: string): Observable<any> {
    return this.http.post(this.url + '/user/verify-otp', { phone, otp });
  }

  // Admin auth
  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(this.url + '/admin/login', { email, password });
  }

  // Session helpers
  setUser(user: any) {
    localStorage.setItem('juice_user', JSON.stringify(user));
    localStorage.setItem('juice_role', 'user');
  }

  setAdmin(admin: any) {
    localStorage.setItem('juice_admin', JSON.stringify(admin));
    localStorage.setItem('juice_role', 'admin');
  }

  getUser(): any {
    const u = localStorage.getItem('juice_user');
    return u ? JSON.parse(u) : null;
  }

  getAdmin(): any {
    const a = localStorage.getItem('juice_admin');
    return a ? JSON.parse(a) : null;
  }

  getRole(): string | null {
    return localStorage.getItem('juice_role');
  }

  isUserLoggedIn(): boolean {
    return this.getRole() === 'user' && this.getUser() !== null;
  }

  isAdminLoggedIn(): boolean {
    return this.getRole() === 'admin' && this.getAdmin() !== null;
  }

  logout() {
    localStorage.removeItem('juice_user');
    localStorage.removeItem('juice_admin');
    localStorage.removeItem('juice_role');
  }
}
