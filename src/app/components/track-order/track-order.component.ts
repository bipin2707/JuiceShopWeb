import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TrackingService } from '../../services/tracking.service';

declare var L: any;

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  orderId = '';
  searchOrderId = '';
  tracking = false;
  status = '';
  deliveryPersonName = '';
  updatedAt = '';
  message = '';
  error = '';
  loading = false;
  searched = false;

  private map: any = null;
  private marker: any = null;
  private customerMarker: any = null;
  private routeLine: any = null;
  private customerLat: number = 0;
  private customerLng: number = 0;
  private refreshInterval: any = null;
  private lastRouteFetch: number = 0;

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('orderId');
    if (id) {
      this.orderId = id;
      this.searchOrderId = id;
      this.startTracking();
    }
  }

  ngOnDestroy() {
    this.stopRefresh();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  searchTrack() {
    if (!this.searchOrderId.trim()) {
      this.error = 'Please enter an Order ID.';
      return;
    }
    this.orderId = this.searchOrderId.trim();
    this.startTracking();
  }

  startTracking() {
    this.error = '';
    this.message = '';
    this.loading = true;
    this.searched = true;
    this.tracking = false;

    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.customerMarker = null;
      this.routeLine = null;
    }

    this.fetchLocation();

    this.stopRefresh();
    var self = this;
    this.refreshInterval = setInterval(function() {
      self.fetchLocation();
    }, 5000);
  }

  fetchLocation() {
    var self = this;
    this.trackingService.trackOrder(this.orderId).subscribe(
      function(data: any) {
        self.loading = false;
        self.status = data.status;

        if (data.tracking) {
          self.tracking = true;
          self.deliveryPersonName = data.deliveryPersonName || 'Delivery Partner';
          self.updatedAt = data.updatedAt || '';
          self.message = '';

          // Store customer coordinates
          if (data.customerLatitude && data.customerLongitude) {
            self.customerLat = data.customerLatitude;
            self.customerLng = data.customerLongitude;
          }

          self.updateMap(data.latitude, data.longitude);
        } else {
          self.tracking = false;
          self.message = data.message || 'Tracking not available yet.';
        }
      },
      function(err: any) {
        self.loading = false;
        self.error = (err.error && err.error.message) || 'Failed to fetch tracking info.';
        self.stopRefresh();
      }
    );
  }

  updateMap(lat: number, lng: number) {
    if (!this.map) {
      this.map = L.map('tracking-map').setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);

      var deliveryIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.marker = L.marker([lat, lng], { icon: deliveryIcon }).addTo(this.map);
      this.marker.bindPopup('<b>' + this.deliveryPersonName + '</b><br>Delivering your order').openPopup();

      // Show customer's own location marker
      if (this.customerLat && this.customerLng) {
        var customerIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        this.customerMarker = L.marker([this.customerLat, this.customerLng], { icon: customerIcon }).addTo(this.map);
        this.customerMarker.bindPopup('<b>Your Location</b>');

        // Fetch route
        this.fetchRoute(lat, lng, this.customerLat, this.customerLng);
      }
    } else {
      this.marker.setLatLng([lat, lng]);
      this.marker.setPopupContent('<b>' + this.deliveryPersonName + '</b><br>Delivering your order');

      // Update route every 30 seconds
      var now = Date.now();
      if (this.customerLat && this.customerLng && (now - this.lastRouteFetch > 30000)) {
        this.fetchRoute(lat, lng, this.customerLat, this.customerLng);
      }
    }
  }

  fetchRoute(fromLat: number, fromLng: number, toLat: number, toLng: number) {
    var url = 'https://router.project-osrm.org/route/v1/driving/' +
      fromLng + ',' + fromLat + ';' + toLng + ',' + toLat +
      '?overview=full&geometries=geojson';

    this.lastRouteFetch = Date.now();
    var self = this;
    this.http.get(url).subscribe(
      function(data: any) {
        if (data && data.routes && data.routes.length > 0) {
          var coords = data.routes[0].geometry.coordinates;
          var latLngs = [];
          for (var i = 0; i < coords.length; i++) {
            latLngs.push([coords[i][1], coords[i][0]]);
          }

          if (self.routeLine) {
            self.map.removeLayer(self.routeLine);
          }

          self.routeLine = L.polyline(latLngs, {
            color: '#2e7d32',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(self.map);

          // Fit map to show full route
          var layers = [self.marker];
          if (self.customerMarker) layers.push(self.customerMarker);
          layers.push(self.routeLine);
          var group = L.featureGroup(layers);
          self.map.fitBounds(group.getBounds().pad(0.1));
        }
      },
      function() {}
    );
  }

  getStatusStep(): number {
    if (this.status === 'PENDING') return 1;
    if (this.status === 'ACCEPTED') return 2;
    if (this.status === 'OUT_FOR_DELIVERY' || this.tracking) return 3;
    if (this.status === 'DELIVERED') return 4;
    return 0;
  }

  stopRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
