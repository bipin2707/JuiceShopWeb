import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = environment.apiUrl + '/Order';

  constructor(private http: HttpClient) {}

  placeOrder(juiceId: string, userId: string): Observable<any> {
    return this.http.post(this.url + '/place', { juiceId, userId });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  acceptOrder(id: string): Observable<any> {
    return this.http.post(this.url + '/accept/' + id, {});
  }

  rejectOrder(id: string): Observable<any> {
    return this.http.post(this.url + '/reject/' + id, {});
  }
}
