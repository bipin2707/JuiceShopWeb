import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = environment.apiUrl + '/Order';

  constructor(private http: HttpClient) {}

  placeOrder(customerName: string, phone: string, location: string, items: any[]): Observable<any> {
    return this.http.post(this.url + '/place', {
      customerName: customerName,
      phone: phone,
      location: location,
      items: items
    });
  }

  placeOrderWithCoords(orderData: any): Observable<any> {
    return this.http.post(this.url + '/place', orderData);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getMyOrders(phone: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/my-orders/' + phone);
  }

  getDashboard(from: string, to: string): Observable<any> {
    return this.http.get(this.url + '/dashboard?from=' + from + '&to=' + to);
  }

  acceptOrder(id: string): Observable<any> {
    return this.http.post(this.url + '/accept/' + id, {});
  }

  rejectOrder(id: string): Observable<any> {
    return this.http.post(this.url + '/reject/' + id, {});
  }

  markOutForDelivery(id: string, deliveryBoyName?: string): Observable<any> {
    var url = this.url + '/out-for-delivery/' + id;
    if (deliveryBoyName) {
      url += '?deliveryBoyName=' + encodeURIComponent(deliveryBoyName);
    }
    return this.http.post(url, {});
  }

  markDelivered(id: string): Observable<any> {
    return this.http.post(this.url + '/delivered/' + id, {});
  }
}
