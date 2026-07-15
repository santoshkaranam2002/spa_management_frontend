import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../layout/icon';
import { AppNotification } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── DATA ─────────────────
  allNotifications: AppNotification[] = [];

  // ───────────────── UI STATE ─────────────────
  filter: 'All' | 'Unread' = 'All';

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getNotifications();
  }

  // ───────────────── GET ALL ─────────────────
  getNotifications(): void {
    this.spaService.getNotifications().subscribe({
      next: (res: any) => { this.allNotifications = res.Result || []; },
      error: (err: any) => console.error('❌ [Notifications API Error]', err)
    });
  }

  get notifications(): AppNotification[] {
    return this.allNotifications.filter(n => this.filter === 'All' || !n.isRead);
  }
  get unreadCount(): number {
    return this.allNotifications.filter(n => !n.isRead).length;
  }

  setFilter(f: 'All' | 'Unread'): void { this.filter = f; }

  toneClass(t: string): string {
    const m: Record<string, string> = { Plum: 'plum', Gold: 'gold', Sage: 'sage', Info: 'info', Rose: 'rose', Danger: 'red' };
    return m[t] || 'plum';
  }
  toneIcon(t: string): string {
    const m: Record<string, string> = { Plum: 'calendar', Gold: 'tag', Sage: 'money', Info: 'bell', Rose: 'star', Danger: 'ban' };
    return m[t] || 'bell';
  }

  // ───────────────── MARK READ ─────────────────
  markRead(n: AppNotification): void {
    this.spaService.updateNotification(n.id, { isRead: true }).subscribe({
      next: () => { n.isRead = true; },
      error: (err: any) => console.error('❌ [Notification Update Error]', err)
    });
  }

  markAll(): void {
    this.allNotifications.forEach(n => {
      if (!n.isRead) {
        this.spaService.updateNotification(n.id, { isRead: true }).subscribe({
          next: () => { n.isRead = true; },
          error: (err: any) => console.error('❌ [Notification Update Error]', err)
        });
      }
    });
  }

  // ───────────────── DELETE ─────────────────
  remove(n: AppNotification): void {
    this.spaService.deleteNotification(n.id).subscribe({
      next: () => { this.allNotifications = this.allNotifications.filter(x => x.id !== n.id); },
      error: (err: any) => console.error('❌ [Notification Delete Error]', err)
    });
  }
}
