import { Component, Output, EventEmitter, signal, inject, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../icon';

const TITLES: Record<string, { title: string; sub: string }> = {
  'dashboard':      { title: 'Dashboard', sub: "Welcome back, Anjali — here's your day at a glance" },
  'daily-bookings': { title: 'Daily Bookings', sub: "Today's appointments and walk-ins" },
  'slots':          { title: 'Slot Management', sub: 'Set availability and manage time slots' },
  'services':       { title: 'Services & Packages', sub: 'Your menu of treatments and bundles' },
  'offers':         { title: 'Offers & Coupons', sub: 'Promotions, banners and discount codes' },
  'customers':      { title: 'Customers', sub: 'Your client book and visit history' },
  'staff':          { title: 'Staff & Roster', sub: 'Team members, skills and availability' },
  'chat':           { title: 'Chat & Calls', sub: 'Talk to your customers in real time' },
  'notifications':  { title: 'Notifications', sub: 'Everything happening across your spa' },
  'reports':        { title: 'Reports', sub: 'Revenue, trends and performance insights' },
  'reviews':        { title: 'Reviews', sub: 'What your customers are saying' },
  'settings':       { title: 'Settings', sub: 'Business profile and preferences' },
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, IconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  private router = inject(Router);

  online = signal(true);
  pageTitle = signal(TITLES['dashboard'].title);
  pageSub = signal(TITLES['dashboard'].sub);

  // ---- Profile / dropdown state ----
  profileOpen = signal(false);

  // Dummy user for now — replace with real user from auth/session later
  currentUser = signal({
    name: 'Anjali Joshi',
    role: 'Owner · Serene Spa',
  });

  get userInitials(): string {
    const parts = this.currentUser().name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects.split('/').filter(Boolean).pop() || 'dashboard';
      const meta = TITLES[url] ?? TITLES['dashboard'];
      this.pageTitle.set(meta.title);
      this.pageSub.set(meta.sub);
    });
  }

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.profileOpen.update(v => !v);
  }

  // Close dropdown when clicking anywhere else on the page
  @HostListener('document:click')
  closeProfile() {
    if (this.profileOpen()) {
      this.profileOpen.set(false);
    }
  }

  logout() {
    // clear session / tokens here
    sessionStorage.clear();
    localStorage.removeItem('token');

    this.profileOpen.set(false);
    this.router.navigate(['/login']);
  }
}