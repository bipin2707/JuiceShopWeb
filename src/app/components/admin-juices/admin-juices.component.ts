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

  constructor(private juiceService: JuiceService) {}

  ngOnInit() {
    this.loadJuices();
  }

  loadJuices() {
    this.loading = true;
    this.juiceService.getAll().subscribe(
      data => { this.juices = data; this.loading = false; },
      () => { this.loading = false; }
    );
  }

  toggle(juice: Juice) {
    this.juiceService.toggleAvailability(juice.id).subscribe(() => {
      juice.isAvailable = !juice.isAvailable;
    });
  }
}
