importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBlAZZz7UbZ45kP-xe-dpNn1i6ddJkSUuM",
  authDomain: "juice-e22e2.firebaseapp.com",
  projectId: "juice-e22e2",
  storageBucket: "juice-e22e2.firebasestorage.app",
  messagingSenderId: "706938520864",
  appId: "1:706938520864:web:c6a37306aef07ade5b0345"
});

var messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  var notificationTitle = payload.notification.title || 'Sonepur Royal Juice';
  var notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var orderId = event.notification.data && event.notification.data.orderId;
  var url = '/my-orders';
  if (orderId) {
    url = '/track-order/' + orderId;
  }
  event.waitUntil(
    clients.openWindow(url)
  );
});
