# What changed in this version

1. Removed all hardcoded/demo data — dashboard and reports now compute
   everything from the live API (booking_get, service_get, customer_get).
   Chat thread is seeded from each conversation's own lastMessage.
   core/data.ts trimmed to interfaces + helpers (old DataStore + seeds deleted).

2. Fixed the "data not showing" bug — the app was zoneless
   (provideZonelessChangeDetection). With the classic plain-property code style,
   values set inside an HTTP subscribe() callback did not refresh the view, so
   screens showed 0/empty. Switched to zone.js change detection
   (provideZoneChangeDetection + zone.js polyfill) — same as your visitor-hub
   project — so plain-property updates render correctly.

Code structure unchanged: constructor injection, named getX() methods,
subscribe({ next, error }), and getters.
