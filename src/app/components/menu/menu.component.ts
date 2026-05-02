import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JuiceService } from '../../services/juice.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Juice } from '../../models/juice.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  juices: Juice[] = [];
  message = '';
  loading = true;
  user: any;

  constructor(
    private juiceService: JuiceService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    if (!this.user) {
      this.router.navigate(['/']);
      return;
    }
    this.loadJuices();
  }

  loadJuices() {
    this.loading = true;
    this.juiceService.getAvailable().subscribe(
      data => { this.juices = data; this.loading = false; },
      () => { this.message = 'Failed to load juices'; this.loading = false; }
    );
  }

  order(juice: Juice) {
    this.orderService.placeOrder(juice.id, this.user.id).subscribe(
      () => { this.message = 'Order placed for ' + juice.name + '!'; },
      () => { this.message = 'Failed to place order.'; }
    );
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
