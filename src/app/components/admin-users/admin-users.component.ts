import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  // Admins
  admins: any[] = [];
  adminName = '';
  adminEmail = '';
  adminPassword = '';
  adminError = '';
  adminSuccess = '';
  adminLoading = false;

  // Delivery Boys
  deliveryBoys: any[] = [];
  dbName = '';
  dbEmail = '';
  dbPassword = '';
  dbPhone = '';
  dbError = '';
  dbSuccess = '';
  dbLoading = false;

  loading = true;

  private authUrl = environment.apiUrl + '/Auth';
  private deliveryUrl = environment.apiUrl + '/Delivery';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    var self = this;

    this.http.get<any[]>(this.authUrl + '/admin/all').subscribe(
      function(data: any) { self.admins = data; },
      function() {}
    );

    this.http.get<any[]>(this.deliveryUrl + '/all').subscribe(
      function(data: any) { self.deliveryBoys = data; self.loading = false; },
      function() { self.loading = false; }
    );
  }

  // ===== Add Admin =====
  addAdmin() {
    this.adminError = '';
    this.adminSuccess = '';

    if (!this.adminName.trim() || !this.adminEmail.trim() || !this.adminPassword.trim()) {
      this.adminError = 'All fields are required.';
      return;
    }

    this.adminLoading = true;
    var self = this;
    this.http.post(this.authUrl + '/admin/seed', {
      name: this.adminName.trim(),
      email: this.adminEmail.trim(),
      password: this.adminPassword.trim()
    }).subscribe(
      function(res: any) {
        self.adminSuccess = res.message || 'Admin created successfully.';
        self.adminLoading = false;
        self.adminName = '';
        self.adminEmail = '';
        self.adminPassword = '';
        self.loadAll();
      },
      function(err: any) {
        self.adminError = (err.error && err.error.message) || 'Failed to create admin.';
        self.adminLoading = false;
      }
    );
  }

  // ===== Add Delivery Boy =====
  addDeliveryBoy() {
    this.dbError = '';
    this.dbSuccess = '';

    if (!this.dbName.trim() || !this.dbEmail.trim() || !this.dbPassword.trim()) {
      this.dbError = 'Name, email, and password are required.';
      return;
    }

    this.dbLoading = true;
    var self = this;
    this.http.post(this.deliveryUrl + '/register', {
      name: this.dbName.trim(),
      email: this.dbEmail.trim(),
      password: this.dbPassword.trim(),
      phone: this.dbPhone.trim() || null
    }).subscribe(
      function(res: any) {
        self.dbSuccess = res.message || 'Delivery boy registered successfully.';
        self.dbLoading = false;
        self.dbName = '';
        self.dbEmail = '';
        self.dbPassword = '';
        self.dbPhone = '';
        self.loadAll();
      },
      function(err: any) {
        self.dbError = (err.error && err.error.message) || 'Failed to register delivery boy.';
        self.dbLoading = false;
      }
    );
  }

  // ===== Toggle Delivery Boy Active =====
  toggleDeliveryBoy(boy: any) {
    var self = this;
    this.http.put(this.deliveryUrl + '/toggle/' + boy.id, {}).subscribe(
      function(res: any) {
        boy.isActive = res.isActive;
      },
      function() {}
    );
  }
}
