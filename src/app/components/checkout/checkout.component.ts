import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification.service';

declare var L: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  customerName = '';
  phone = '';
  location = '';
  landmark = '';
  error = '';
  phoneError = '';
  loading = false;
  orderPlaced = false;
  orderDate = '';
  orderIds: string[] = [];

  // GPS location
  deliveryLatitude: number = 0;
  deliveryLongitude: number = 0;
  locationLoading = false;
  locationError = '';
  locationAcquired = false;

  private map: any = null;
  private marker: any = null;

  constructor(
    public cart: CartService,
    private orderService: OrderService,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  get items(): CartItem[] {
    return this.cart.getItems();
  }

  validatePhone(): boolean {
    var cleaned = this.phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      this.phoneError = 'Phone number must be exactly 10 digits.';
      return false;
    }
    this.phoneError = '';
    return true;
  }

  useCurrentLocation() {
    this.locationError = '';
    this.locationLoading = true;

    if (!navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your browser.';
      this.locationLoading = false;
      return;
    }

    var self = this;
    navigator.geolocation.getCurrentPosition(
      function(position) {
        self.deliveryLatitude = position.coords.latitude;
        self.deliveryLongitude = position.coords.longitude;
        self.locationAcquired = true;
        self.locationLoading = false;

        // Reverse geocode to get street name
        self.reverseGeocode(self.deliveryLatitude, self.deliveryLongitude);

        // Show mini map
        setTimeout(function() { self.showLocationMap(); }, 100);
      },
      function(err) {
        self.locationLoading = false;
        if (err.code === 1) {
          self.locationError = 'Location permission denied. Please allow location access.';
        } else if (err.code === 2) {
          self.locationError = 'Location unavailable. Please try again.';
        } else {
          self.locationError = 'Location request timed out. Please try again.';
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  reverseGeocode(lat: number, lng: number) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1';
    var self = this;
    this.http.get(url).subscribe(
      function(data: any) {
        if (data && data.address) {
          var addr = data.address;
          var parts: string[] = [];
          if (addr.road) parts.push(addr.road);
          if (addr.neighbourhood) parts.push(addr.neighbourhood);
          if (addr.suburb) parts.push(addr.suburb);
          if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
          if (addr.state) parts.push(addr.state);

          if (parts.length > 0) {
            self.location = parts.join(', ');
          } else if (data.display_name) {
            self.location = data.display_name.substring(0, 100);
          } else {
            self.location = lat.toFixed(6) + ', ' + lng.toFixed(6);
          }
        } else {
          self.location = lat.toFixed(6) + ', ' + lng.toFixed(6);
        }
      },
      function() {
        // Fallback to coordinates if geocoding fails
        self.location = lat.toFixed(6) + ', ' + lng.toFixed(6);
      }
    );
  }

  showLocationMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map('checkout-map').setView([this.deliveryLatitude, this.deliveryLongitude], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(this.map);

    var redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([this.deliveryLatitude, this.deliveryLongitude], {
      icon: redIcon,
      draggable: true
    }).addTo(this.map);
    this.marker.bindPopup('<b>Delivery Location</b><br>Drag to adjust').openPopup();

    // Allow dragging marker to adjust location
    var self = this;
    this.marker.on('dragend', function() {
      var pos = self.marker.getLatLng();
      self.deliveryLatitude = pos.lat;
      self.deliveryLongitude = pos.lng;
      // Re-geocode the new position
      self.reverseGeocode(pos.lat, pos.lng);
    });
  }

  removeLocation() {
    this.locationAcquired = false;
    this.deliveryLatitude = 0;
    this.deliveryLongitude = 0;
    this.location = '';
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  placeOrder() {
    this.error = '';
    this.phoneError = '';

    if (!this.customerName.trim()) {
      this.error = 'Please enter your name.';
      return;
    }
    if (!this.validatePhone()) {
      return;
    }
    if (this.items.length === 0) {
      this.error = 'Your cart is empty.';
      return;
    }

    this.loading = true;
    var orderItems = [];
    for (var i = 0; i < this.items.length; i++) {
      orderItems.push({
        juiceId: this.items[i].juice.id,
        quantity: this.items[i].quantity
      });
    }

    var cleanPhone = this.phone.replace(/\D/g, '');
    var self = this;

    var orderData: any = {
      customerName: this.customerName.trim(),
      phone: cleanPhone,
      location: this.location.trim(),
      landmark: this.landmark.trim() || null,
      items: orderItems
    };

    // Include GPS coordinates if available
    if (this.deliveryLatitude !== 0 && this.deliveryLongitude !== 0) {
      orderData.deliveryLatitude = this.deliveryLatitude;
      orderData.deliveryLongitude = this.deliveryLongitude;
    }

    this.orderService.placeOrderWithCoords(orderData).subscribe(
      function(res: any) {
        self.orderPlaced = true;
        self.orderDate = new Date().toLocaleString();
        self.loading = false;
        if (res.orders && res.orders.length > 0) {
          self.orderIds = res.orders.map(function(o: any) { return o.id; });
        }
        // Request notification permission and save token
        self.requestNotifications(cleanPhone);
      },
      function(err: any) {
        self.error = (err.error && err.error.message) || 'Failed to place order.';
        self.loading = false;
      }
    );
  }

  printInvoice() {
    window.print();
  }

  newOrder() {
    this.cart.clear();
    this.router.navigate(['/menu']);
  }

  requestNotifications(phone: string) {
    var self = this;
    this.notificationService.requestPermission().then(function(token) {
      // Save token for this phone number
      self.notificationService.saveTokenForPhone(phone, token).subscribe(
        function() {},
        function() {}
      );
    }).catch(function() {
      // User denied or not supported — no problem
    });
  }
}
