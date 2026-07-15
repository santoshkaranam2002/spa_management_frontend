import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

// Overview
import { DashboardComponent } from './pages/dashboard/dashboard';
import { SettingsComponent } from './pages/settings/settings';

// Main
import { DailyBookingsComponent } from './main/daily-bookings/daily-bookings';
import { SlotsComponent } from './main/slots/slots';
import { ServicesComponent } from './main/services/services';
import { OffersComponent } from './main/offers/offers';

// People
import { CustomersComponent } from './people/customers/customers';
import { StaffComponent } from './people/staff/staff';
import { ChatComponent } from './people/chat/chat';

// Insights
import { NotificationsComponent } from './insights/notifications/notifications';
import { ReportsComponent } from './insights/reports/reports';
import { ReviewsComponent } from './insights/reviews/reviews';

import { Login } from './auth/login/login';

export const routes: Routes = [
  // Login — standalone, NO sidebar/header
  { path: 'login', component: Login },

  // App shell — HAS sidebar + header
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },

      // Main
      {
        path: 'main',
        children: [
          { path: 'daily-bookings', component: DailyBookingsComponent },
          { path: 'slots', component: SlotsComponent },
          { path: 'services', component: ServicesComponent },
          { path: 'offers', component: OffersComponent },
        ],
      },

      // People
      {
        path: 'people',
        children: [
          { path: 'customers', component: CustomersComponent },
          { path: 'staff', component: StaffComponent },
          { path: 'chat', component: ChatComponent },
        ],
      },

      // Insights
      {
        path: 'insights',
        children: [
          { path: 'notifications', component: NotificationsComponent },
          { path: 'reports', component: ReportsComponent },
          { path: 'reviews', component: ReviewsComponent },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];