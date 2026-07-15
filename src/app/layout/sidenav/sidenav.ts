import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../icon';

interface NavItem { label: string; route: string; icon: string; badge?: string; }
interface NavSection { title: string; items: NavItem[]; }

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, IconComponent],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavComponent {
  @Output() closeMobile = new EventEmitter<void>();

  sections: NavSection[] = [
    { title: 'Main', items: [
      { label: 'Dashboard',       route: '/dashboard',            icon: 'dashboard' },
      { label: 'Daily Bookings',  route: '/main/daily-bookings',  icon: 'calendar' },
      { label: 'Slot Management', route: '/main/slots',           icon: 'clock' },
      { label: 'Services',        route: '/main/services',        icon: 'scissors' },
      { label: 'Offers',          route: '/main/offers',          icon: 'gift' },
    ] },
    { title: 'People', items: [
      { label: 'Customers',       route: '/people/customers',     icon: 'users' },
      { label: 'Staff & Roster',  route: '/people/staff',         icon: 'user' },
      { label: 'Chat & Calls',    route: '/people/chat',          icon: 'message' },
    ] },
    { title: 'Insights', items: [
      { label: 'Notifications',   route: '/insights/notifications', icon: 'bell' },
      { label: 'Reports',         route: '/insights/reports',       icon: 'trend' },
      { label: 'Reviews',         route: '/insights/reviews',       icon: 'star' },
    ] },
  ];

  onLinkClick() { this.closeMobile.emit(); }
}
