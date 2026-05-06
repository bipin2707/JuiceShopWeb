import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TrackingService } from '../../services/tracking.service';
import { DeliveryAuthService } from '../../services/delivery-auth.service';

declare var L: any;

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css']
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  selectedOrderId = '';
  deliveryPersonName = '';
  isTracking = false;
  loading = true;
  error = '';
  statusMessage = '';
  currentLat = 0;
  currentLng = 0;

  private map: any = null;
  private marker: any = null;
  private customerMarker: any = null;
  private watchId: number = 0;
  private sendInterval: any = null;

  constructor(
    private trackingService: TrackingService,
    private deliveryAuth: DeliveryAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if delivery boy is logged in
    var deliveryBoy = this.deliveryAuth.getDeliveryBoy();
    if (!deliveryBoy) {
      this.router.navigate(['/delivery-login']);
      return;
    }
    this.deliveryPersonName = deliveryBoy.name;
    this.loadAcceptedOrders();
  }

  ngOnDestroy() {
    this.stopTracking();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  loadAcceptedOrders() {
    this.loading = true;
    var self = this;
    this.trackingService.getAcceptedOrders().subscribe(
      function(data: any) {
        self.orders = data;
        self.loading = false;
      },
      function() {
        self.loading = false;
        self.error = 'Failed to load orders.';
      }
    );
  }

  startTracking() {
    if (!this.selectedOrderId) {
      this.error = 'Please select an order to deliver.';
      return;
    }

    this.error = '';
    this.isTracking = true;
    this.statusMessage = 'Getting your location...';

    var self = this;

    if (!navigator.geolocation) {
      self.error = 'Geolocation is not supported by your browser.';
      self.isTracking = false;
      return;
    }

    // Watch position continuously
    this.watchId = navigator.geolocation.watchPosition(
      function(position) {
        self.currentLat = position.coords.latitude;
        self.currentLng = position.coords.longitude;
        self.statusMessage = 'Location acquired. Sending updates...';
        self.updateMapPosition(self.currentLat, self.currentLng);
      },
      function(err) {
        self.error = 'Location error: ' + err.message;
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    // Send location to server every 5 seconds
    this.sendInterval = setInterval(function() {
      if (self.currentLat !== 0 && self.currentLng !== 0) {
        self.sendLocation();
      }
    }, 5000);
  }

  sendLocation() {
    var self = this;
    this.trackingService.updateLocation(
      this.selectedOrderId,
      this.currentLat,
      this.currentLng,
      this.deliveryPersonName
    ).subscribe(
      function() {
        self.statusMessage = 'Location sent. Lat: ' +
          self.currentLat.toFixed(6) + ', Lng: ' + self.currentLng.toFixed(6);
      },
      function(err: any) {
        self.error = (err.error && err.error.message) || 'Failed to send location.';
      }
    );
  }

  updateMapPosition(lat: number, lng: number) {
    if (!this.map) {
      this.map = L.map('delivery-map').setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);

      var deliveryIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.marker = L.marker([lat, lng], { icon: deliveryIcon }).addTo(this.map);
      this.marker.bindPopup('<b>Your Location</b>').openPopup();

      // Show customer's delivery location if available
      var selectedOrder = this.getSelectedOrder();
      if (selectedOrder && selectedOrder.deliveryLatitude && selectedOrder.deliveryLongitude) {
        var customerIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        this.customerMarker = L.marker(
          [selectedOrder.deliveryLatitude, selectedOrder.deliveryLongitude],
          { icon: customerIcon }
        ).addTo(this.map);
        this.customerMarker.bindPopup('<b>Customer Location</b><br>' + (selectedOrder.location || selectedOrder.customerName));

        // Fit bounds to show both markers
        var group = L.featureGroup([this.marker, this.customerMarker]);
        this.map.fitBounds(group.getBounds().pad(0.2));
      }
    } else {
      this.marker.setLatLng([lat, lng]);
    }
  }

  getSelectedOrder(): any {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === this.selectedOrderId) return this.orders[i];
    }
    return null;
  }

  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = 0;
    }
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
    }

    if (this.isTracking && this.selectedOrderId) {
      var self = this;
      this.trackingService.stopTracking(this.selectedOrderId).subscribe(
        function() {
          self.statusMessage = 'Delivery completed. Tracking stopped.';
        },
        function() {}
      );
    }

    this.isTracking = false;
  }

  completeDelivery() {
    this.stopTracking();
    this.statusMessage = 'Delivery marked as completed!';
    this.selectedOrderId = '';
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.customerMarker = null;
    }
  }
}
