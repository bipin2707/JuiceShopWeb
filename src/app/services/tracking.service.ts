import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private url = environment.apiUrl + '/Location';

  constructor(private http: HttpClient) {}

  /** Update delivery boy's live location */
  updateLocation(orderId: string, latitude: number, longitude: number, deliveryPersonName: string): Observable<any> {
    return this.http.post(this.url + '/update', {
      orderId: orderId,
      latitude: latitude,
      longitude: longitude,
      deliveryPersonName: deliveryPersonName
    });
  }

  /** Get delivery location for customer tracking */
  trackOrder(orderId: string): Observable<any> {
    return this.http.get(this.url + '/track/' + orderId);
  }

  /** Get all active deliveries (admin) */
  getActiveDeliveries(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/active');
  }

  /** Stop tracking for an order */
  stopTracking(orderId: string): Observable<any> {
    return this.http.post(this.url + '/stop/' + orderId, {});
  }

  /** Get accepted orders for delivery person */
  getAcceptedOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/orders/accepted');
  }

  /** Get delivery boy's own active orders */
  getMyDeliveries(deliveryBoyName: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/orders/my-deliveries?deliveryBoyName=' + encodeURIComponent(deliveryBoyName));
  }
}
