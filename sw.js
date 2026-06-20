self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Bolão Mundial 2026', {
      body: data.body || 'Tens jogos para palpitar!',
      icon: '/icon.png',
      badge: '/icon.png',
      tag: data.tag || 'bolao',
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
