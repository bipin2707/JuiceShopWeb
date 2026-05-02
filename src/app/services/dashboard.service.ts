import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = environment.apiUrl + '/Order/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(this.url);
  }
}
