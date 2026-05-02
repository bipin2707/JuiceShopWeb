import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Juice } from '../models/juice.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JuiceService {
  private url = environment.apiUrl + '/Juice';

  constructor(private http: HttpClient) {}

  getAvailable(): Observable<Juice[]> {
    return this.http.get<Juice[]>(this.url + '/available');
  }

  getAll(): Observable<Juice[]> {
    return this.http.get<Juice[]>(this.url + '/all');
  }

  toggleAvailability(id: string): Observable<any> {
    return this.http.put(this.url + '/toggle/' + id, {});
  }
}
