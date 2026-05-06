import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = environment.apiUrl + '/Auth';

  constructor(private http: HttpClient) {}

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(this.url + '/admin/login', { email: email, password: password });
  }

  setAdmin(admin: any) {
    // Clear any other session first
    localStorage.removeItem('juice_delivery_boy');
    // Set admin session
    localStorage.setItem('juice_admin', JSON.stringify(admin));
    localStorage.setItem('juice_role', 'admin');
  }

  getAdmin(): any {
    var a = localStorage.getItem('juice_admin');
    return a ? JSON.parse(a) : null;
  }

  isAdminLoggedIn(): boolean {
    return localStorage.getItem('juice_role') === 'admin' && this.getAdmin() !== null;
  }

  logout() {
    localStorage.removeItem('juice_admin');
    localStorage.removeItem('juice_role');
  }
}
