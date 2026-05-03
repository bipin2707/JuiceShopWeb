import { Component, OnInit } from '@angular/core';
import { JuiceService } from '../../services/juice.service';
import { Juice } from '../../models/juice.model';

@Component({
  selector: 'app-admin-juices',
  templateUrl: './admin-juices.component.html',
  styleUrls: ['./admin-juices.component.css']
})
export class AdminJuicesComponent implements OnInit {
  juices: Juice[] = [];
  loading = true;
  showForm = false;
  newName = '';
  newPrice: number = 0;
  newAvailable = true;
  message = '';

  constructor(private juiceService: JuiceService) {}

  ngOnInit() { this.loadJuices(); }

  loadJuices() {
    this.loading = true;
    this.juiceService.getAll().subscribe(
      function(data) { this.juices = data; this.loading = false; }.bind(this),
      function() { this.loading = false; }.bind(this)
    );
  }

  toggle(juice: Juice) {
    this.juiceService.toggleAvailability(juice.id).subscribe(function() {
      juice.isAvailable = !juice.isAvailable;
    });
  }

  addJuice() {
    if (!this.newName.trim() || this.newPrice <= 0) {
      this.message = 'Please enter a valid name and price.';
      return;
    }
    var self = this;
    this.juiceService.addJuice(this.newName.trim(), this.newPrice, this.newAvailable).subscribe(
      function(res) {
        self.message = 'Juice added!';
        self.newName = '';
        self.newPrice = 0;
        self.newAvailable = true;
        self.showForm = false;
        self.loadJuices();
      },
      function() { self.message = 'Failed to add juice.'; }
    );
  }
}
