import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare var firebase: any;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging: any = null;
  private token: string = '';
  private vapidKey = 'BDTesvh5vlnoNLrI-85xj2vGLT1X1brZdr6ZrJbtuuAcDufARLnOiPVJKieESAg5CD2RVyy1MFFKnWtcEUm-SK8';

  constructor(private http: HttpClient) {
    this.initMessaging();
  }

  private initMessaging() {
    try {
      if (typeof firebase !== 'undefined' && firebase.messaging) {
        this.messaging = firebase.messaging();

        // Handle foreground messages
        var self = this;
        this.messaging.onMessage(function(payload: any) {
          // Show notification even when app is in foreground
          if ((Notification as any).permission === 'granted') {
            var title = payload.notification ? payload.notification.title : 'Sonepur Royal Juice';
            var body = payload.notification ? payload.notification.body : 'You have a notification';
            var notification = new Notification(title, {
              body: body,
              icon: '/favicon.ico'
            });
            notification.onclick = function() {
              window.focus();
              if (payload.data && payload.data.orderId) {
                window.location.href = '/my-orders';
              }
              notification.close();
            };
          }
        });
      }
    } catch (e) {
      console.log('Firebase messaging not supported');
    }
  }

  /** Request notification permission and get FCM token */
  requestPermission(): Promise<string> {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (!self.messaging) {
        reject('Firebase messaging not available');
        return;
      }

      (Notification as any).requestPermission().then(function(permission: string) {
        if (permission === 'granted') {
          // Register service worker
          navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function(registration) {
            self.messaging.getToken({
              vapidKey: self.vapidKey,
              serviceWorkerRegistration: registration
            }).then(function(token: string) {
              self.token = token;
              // Save token to localStorage
              localStorage.setItem('juice_fcm_token', token);
              resolve(token);
            }).catch(function(err: any) {
              reject('Failed to get token: ' + err);
            });
          }).catch(function(err: any) {
            reject('Service worker registration failed: ' + err);
          });
        } else {
          reject('Notification permission denied');
        }
      });
    });
  }

  /** Get stored token */
  getToken(): string {
    return this.token || localStorage.getItem('juice_fcm_token') || '';
  }

  /** Save FCM token to backend for an order */
  saveTokenForOrder(orderId: string, fcmToken: string) {
    return this.http.post(environment.apiUrl + '/Notification/register', {
      orderId: orderId,
      fcmToken: fcmToken
    });
  }

  /** Save FCM token for a phone number (all orders) */
  saveTokenForPhone(phone: string, fcmToken: string, role?: string) {
    return this.http.post(environment.apiUrl + '/Notification/register-phone', {
      phone: phone,
      fcmToken: fcmToken,
      role: role || 'customer'
    });
  }

  /** Notify admins about new order */
  notifyNewOrder(customerName: string, phone: string, itemSummary: string) {
    return this.http.post(environment.apiUrl + '/Notification/notify-new-order', {
      customerName: customerName,
      phone: phone,
      itemSummary: itemSummary
    });
  }

  /** Notify delivery boys about accepted order */
  notifyOrderAccepted(orderId: string) {
    return this.http.post(environment.apiUrl + '/Notification/notify-order-accepted/' + orderId, {});
  }
}
