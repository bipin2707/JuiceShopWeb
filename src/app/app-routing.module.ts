import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminJuicesComponent } from './components/admin-juices/admin-juices.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { TrackOrderComponent } from './components/track-order/track-order.component';
import { DeliveryTrackingComponent } from './components/delivery-tracking/delivery-tracking.component';
import { AdminLiveMapComponent } from './components/admin-live-map/admin-live-map.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { DeliveryLoginComponent } from './components/delivery-login/delivery-login.component';
import { DeliveryDashboardComponent } from './components/delivery-dashboard/delivery-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'track-order/:orderId', component: TrackOrderComponent },

  // Delivery boy routes
  { path: 'delivery-login', component: DeliveryLoginComponent },
  { path: 'delivery/dashboard', component: DeliveryDashboardComponent },
  { path: 'delivery/track', component: DeliveryTrackingComponent },

  // Admin routes
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/juices', component: AdminJuicesComponent },
  { path: 'admin/orders', component: AdminOrdersComponent },
  { path: 'admin/live-map', component: AdminLiveMapComponent },
  { path: 'admin/users', component: AdminUsersComponent },

  { path: '**', redirectTo: 'menu' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
