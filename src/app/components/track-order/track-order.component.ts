import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private refreshInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    // Check if orderId is passed as route param
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

    // Reset map if switching orders
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }

    this.fetchLocation();

    // Auto-refresh every 5 seconds
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
    } else {
      this.marker.setLatLng([lat, lng]);
      this.map.panTo([lat, lng]);
    }
  }

  getStatusStep(): number {
    if (this.status === 'PENDING') return 1;
    if (this.status === 'ACCEPTED') return 2;
    if (this.tracking) return 3;
    return 0;
  }

  stopRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }
}
