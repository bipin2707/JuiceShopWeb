import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CartComponent,
    CheckoutComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminJuicesComponent,
    AdminOrdersComponent,
    TrackOrderComponent,
    DeliveryTrackingComponent,
    AdminLiveMapComponent,
    MyOrdersComponent,
    DeliveryLoginComponent,
    DeliveryDashboardComponent,
    AdminUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
