import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';

declare var L: any;

@Component({
  selector: 'app-admin-live-map',
  templateUrl: './admin-live-map.component.html',
  styleUrls: ['./admin-live-map.component.css']
})
export class AdminLiveMapComponent implements OnInit, OnDestroy {
  deliveries: any[] = [];
  loading = true;
  error = '';

  private map: any = null;
  private markers: any[] = [];
  private refreshInterval: any = null;

  constructor(private trackingService: TrackingService) {}

  ngOnInit() {
    this.loadDeliveries();

    // Auto-refresh every 5 seconds
    var self = this;
    this.refreshInterval = setInterval(function() {
      self.loadDeliveries();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  loadDeliveries() {
    var self = this;
    this.trackingService.getActiveDeliveries().subscribe(
      function(data: any) {
        self.deliveries = data;
        self.loading = false;
        self.updateMap();
      },
      function(err: any) {
        self.loading = false;
        self.error = 'Failed to load active deliveries.';
      }
    );
  }

  updateMap() {
    if (this.deliveries.length === 0) return;

    // Initialize map if not already done
    if (!this.map) {
      var firstDelivery = this.deliveries[0];
      this.map = L.map('admin-live-map').setView([firstDelivery.latitude, firstDelivery.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);
    }

    // Clear existing markers
    for (var i = 0; i < this.markers.length; i++) {
      this.map.removeLayer(this.markers[i]);
    }
    this.markers = [];

    // Add markers for each active delivery
    var deliveryIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    for (var j = 0; j < this.deliveries.length; j++) {
      var d = this.deliveries[j];
      var marker = L.marker([d.latitude, d.longitude], { icon: deliveryIcon }).addTo(this.map);
      marker.bindPopup(
        '<b>' + (d.deliveryPersonName || 'Delivery Partner') + '</b><br>' +
        'Customer: ' + d.customerName + '<br>' +
        'Phone: ' + (d.phone || 'N/A') + '<br>' +
        'Destination: ' + (d.deliveryLocation || 'N/A') + '<br>' +
        '<small>Updated: ' + (d.updatedAt || '') + '</small>'
      );
      this.markers.push(marker);
    }

    // Fit bounds to show all markers
    if (this.markers.length > 0) {
      var group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
