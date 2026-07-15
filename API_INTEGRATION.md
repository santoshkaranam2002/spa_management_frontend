# Spa Partner Frontend — API Integration

This frontend now talks to the Django backend (see the spa-backend folder).

- API base URL is set in `src/app/services/api.service.ts` (`API` constant):
  `http://localhost:8000/api`
- `ApiService` (mirrors the hostel `HostelService`) provides get/create/update/
  delete for every domain and hydrates the shared `DataStore` signals.
- Each page fetches its data in `ngOnInit()` and routes create/update/delete
  through `ApiService` so changes persist to the backend.
- Seed data in `core/data.ts` is kept only as an offline fallback; once the API
  responds it overwrites the store.

## Run
1. Start the backend first (see spa-backend/README.md) on :8000.
2. Then:
   ```
   npm install
   npm start
   ```
   Open http://localhost:4200

## Highlights
- **Daily Bookings**: shows an **Active Offers** count and a **Staff** dropdown
  in the New Booking form (persists to the booking's `staff` field).
- **Slot Management**: block/unblock slots and toggle working days persist.
