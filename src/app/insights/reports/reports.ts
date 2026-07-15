import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../layout/icon';
import { formatCurrency, ChartPoint, TopService, Booking, Service, Customer } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── UI STATE ─────────────────
  range: 'Week' | 'Month' | 'Year' = 'Year';
  toast = '';

  // ───────────────── DATA (all from API) ─────────────────
  allBookings: Booking[] = [];
  allServices: Service[] = [];
  allCustomers: Customer[] = [];

  chart: ChartPoint[] = [];
  top: TopService[] = [];
  chartMax = 1;
  topTotal = 1;

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getReportData();
  }

  // ───────────────── GET ─────────────────
  getReportData(): void {
    this.spaService.getBookings().subscribe({
      next: (res: any) => { this.allBookings = res.Result || []; this.buildChart(); },
      error: (err: any) => console.error('❌ [Bookings API Error]', err)
    });
    this.spaService.getServices().subscribe({
      next: (res: any) => { this.allServices = res.Result || []; this.buildTopServices(); },
      error: (err: any) => console.error('❌ [Services API Error]', err)
    });
    this.spaService.getCustomers().subscribe({
      next: (res: any) => { this.allCustomers = res.Result || []; },
      error: (err: any) => console.error('❌ [Customers API Error]', err)
    });
  }

  // ───────────────── BUILD CHART / TOP FROM API ─────────────────
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
  private buildTopServices(): void {
    const palette = ['var(--plum-500)', 'var(--gold)', 'var(--sage)', 'var(--info)', 'var(--plum-200)'];
    const sorted = [...this.allServices].sort((a, b) => b.bookings - a.bookings);
    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4).reduce((a, s) => a + s.bookings, 0);
    this.top = top4.map((s, i) => ({ name: s.name, bookings: s.bookings, color: palette[i] }));
    if (others > 0) this.top.push({ name: 'Others', bookings: others, color: palette[4] });
    this.topTotal = Math.max(1, this.top.reduce((a, t) => a + t.bookings, 0));
  }

  // ───────────────── KPIs (computed from API) ─────────────────
  get kpis() {
    const nonCancelled = this.allBookings.filter(b => b.status !== 'Cancelled');
    const revenue = nonCancelled.reduce((a, b) => a + b.price, 0);
    const appointments = this.allBookings.length;
    const avgTicket = appointments ? Math.round(revenue / appointments) : 0;
    const repeatRate = this.allCustomers.length
      ? Math.round((this.allCustomers.filter(c => c.totalVisits > 1).length / this.allCustomers.length) * 100)
      : 0;
    return [
      { label: 'Total Revenue', value: formatCurrency(revenue, 'INR'), trend: '+18%', up: true, icon: 'rupee', tone: 'plum' },
      { label: 'Appointments', value: String(appointments), trend: '+12%', up: true, icon: 'calendar', tone: 'sage' },
      { label: 'Avg. Ticket', value: formatCurrency(avgTicket, 'INR'), trend: '+6%', up: true, icon: 'money', tone: 'gold' },
      { label: 'Repeat Rate', value: repeatRate + '%', trend: '-3%', up: false, icon: 'heart', tone: 'rose' },
    ];
  }

  setRange(r: 'Week' | 'Month' | 'Year'): void { this.range = r; }
  barPct(v: number): number { return Math.round((v / this.chartMax) * 100); }
  ringPct(v: number): number { return Math.round((v / this.topTotal) * 100); }
  cur(n: number): string { return formatCurrency(n, 'INR'); }

  exportReport(): void {
    this.toast = 'Report exported (demo) — CSV ready';
    setTimeout(() => this.toast = '', 2600);
  }
}
