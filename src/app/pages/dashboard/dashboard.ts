import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../layout/icon';
import { initials, formatCurrency, Booking, StatCard, ChartPoint, TopService, AppNotification, Service } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA (all from API) ─────────────────
  allBookings: Booking[] = [];
  allServices: Service[] = [];
  activity: AppNotification[] = [];

  // built from the API data below
  chart: ChartPoint[] = [];
  top: TopService[] = [];
  chartMax = 1;
  topTotal = 1;

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getDashboardData();
  }

  // ───────────────── GET DASHBOARD DATA ─────────────────
  getDashboardData(): void {
    this.spaService.getBookings().subscribe({
      next: (res: any) => {
        this.allBookings = res.Result || [];
        this.buildChart();
      },
      error: (err: any) => console.error('❌ [Bookings API Error]', err)
    });

    this.spaService.getServices().subscribe({
      next: (res: any) => {
        this.allServices = res.Result || [];
        this.buildTopServices();
      },
      error: (err: any) => console.error('❌ [Services API Error]', err)
    });

    this.spaService.getNotifications().subscribe({
      next: (res: any) => { this.activity = (res.Result || []).slice(0, 5); },
      error: (err: any) => console.error('❌ [Notifications API Error]', err)
    });
  }

  // ───────────────── BUILD REVENUE CHART FROM BOOKINGS ─────────────────
  private buildChart(): void {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totals = new Array(12).fill(0);
    this.allBookings.forEach(b => {
      if (b.status === 'Cancelled') return;
      const d = new Date(b.date || "");
      if (!isNaN(d.getTime())) totals[d.getMonth()] += b.price;
    });
    this.chart = months.map((label, i) => ({ label, value: totals[i] }));
    this.chartMax = Math.max(1, ...this.chart.map(c => c.value));
  }

  // ───────────────── BUILD TOP SERVICES FROM SERVICES ─────────────────
  private buildTopServices(): void {
    const palette = ['var(--plum-500)', 'var(--gold)', 'var(--sage)', 'var(--info)', 'var(--plum-200)'];
    const sorted = [...this.allServices].sort((a, b) => b.bookings - a.bookings);
    const top4 = sorted.slice(0, 4);
    const othersBookings = sorted.slice(4).reduce((a, s) => a + s.bookings, 0);

    this.top = top4.map((s, i) => ({ name: s.name, bookings: s.bookings, color: palette[i] }));
    if (othersBookings > 0) this.top.push({ name: 'Others', bookings: othersBookings, color: palette[4] });
    this.topTotal = Math.max(1, this.top.reduce((a, t) => a + t.bookings, 0));
  }

  // ───────────────── DERIVED STAT CARDS ─────────────────
  get stats(): StatCard[] {
    const b = this.allBookings;
    const revenue = b.filter(x => x.status !== 'Cancelled').reduce((a, x) => a + x.price, 0);
    const activeServices = this.allServices.filter(s => s.isActive).length;
    return [
      { label: 'Total Bookings', value: String(b.length), trend: '+12%', trendUp: true, footer: 'Today · live count', icon: 'calendar', accentBg: 'var(--plum-50)', iconBg: 'var(--plum-100)', iconColor: 'var(--plum-600)' },
      { label: 'Active Services', value: String(activeServices), trend: '+4', trendUp: true, footer: 'Live · currently offered', icon: 'sparkle', accentBg: 'var(--sage-soft)', iconBg: '#D8E5D6', iconColor: '#4F6B51' },
      { label: 'Completed Today', value: String(b.filter(x => x.status === 'Completed').length), trend: '+24%', trendUp: true, footer: 'Finished appointments', icon: 'check', accentBg: 'var(--gold-soft)', iconBg: '#F2DEB8', iconColor: '#8A5E20' },
      { label: 'Revenue', value: formatCurrency(revenue, 'INR'), trend: '+18%', trendUp: true, footer: 'Day total · non-cancelled', icon: 'rupee', accentBg: 'var(--rose-soft)', iconBg: '#FBD7E5', iconColor: 'var(--plum-600)' },
    ];
  }
  get upcoming(): Booking[] { return this.allBookings.slice(0, 5); }

  cur(n: number): string { return formatCurrency(n, 'INR'); }
  statusClass(s: Booking['status']): string {
    const m: Record<string, string> = { Confirmed: 'sage', InProgress: 'gold', Pending: 'amber', Cancelled: 'red', Completed: 'green' };
    return 'sp-badge ' + (m[s] || 'gray');
  }
  statusLabel(s: Booking['status']): string { return s === 'InProgress' ? 'In Progress' : s; }
  toneClass(t: string): string {
    const m: Record<string, string> = { Plum: 'plum', Gold: 'gold', Sage: 'sage', Info: 'info', Rose: 'rose', Danger: 'red' };
    return m[t] || 'plum';
  }
  barPct(v: number): number { return Math.round((v / this.chartMax) * 100); }
  ringPct(v: number): number { return Math.round((v / this.topTotal) * 100); }
}
