import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeliveryAuthService {
  private url = environment.apiUrl + '/Delivery';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', { email: email, password: password });
  }

  getDashboard(deliveryBoyId: string): Observable<any> {
    return this.http.get(this.url + '/dashboard/' + deliveryBoyId);
  }

  setDeliveryBoy(deliveryBoy: any) {
    // Clear any other session first
    localStorage.removeItem('juice_admin');
    // Set delivery session
    localStorage.setItem('juice_delivery_boy', JSON.stringify(deliveryBoy));
    localStorage.setItem('juice_role', 'delivery');
  }

  getDeliveryBoy(): any {
    var d = localStorage.getItem('juice_delivery_boy');
    return d ? JSON.parse(d) : null;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('juice_role') === 'delivery' && this.getDeliveryBoy() !== null;
  }

  logout() {
    localStorage.removeItem('juice_delivery_boy');
    localStorage.removeItem('juice_role');
  }
}
