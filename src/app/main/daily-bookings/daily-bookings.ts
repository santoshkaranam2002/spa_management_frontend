import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { initials, formatCurrency, Booking, StaffMember, Service, TimeSlot } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-daily-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './daily-bookings.html',
  styleUrl: './daily-bookings.scss',
})
export class DailyBookingsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA ─────────────────
  allBookings: Booking[] = [];
  staffList: StaffMember[] = [];
  allServices: Service[] = [];
  allSlots: TimeSlot[] = [];
  activeOffers = 0;

  // ───────────────── UI STATE ─────────────────
  filters = ['All', 'Confirmed', 'InProgress', 'Pending', 'Completed', 'Cancelled'];
  active = 'All';
  search = '';
  toast = '';
  showAdd = false;

  // ───────────────── FORM ─────────────────
  form = { customerName: '', service: '', price: 0, slotId: 0, time: '', staff: '' };

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getBookings();
    this.getStaff();
    this.getOffers();
    this.getServices();
    this.getSlots();
  }

  // ───────────────── GET ─────────────────
  getBookings(): void {
    this.spaService.getBookings().subscribe({
      next: (res: any) => { this.allBookings = res.Result || []; },
      error: (err: any) => console.error('❌ [Bookings API Error]', err)
    });
  }
  getStaff(): void {
    this.spaService.getStaff().subscribe({
      next: (res: any) => { this.staffList = res.Result || []; },
      error: (err: any) => console.error('❌ [Staff API Error]', err)
    });
  }
  getServices(): void {
    this.spaService.getServices().subscribe({
      next: (res: any) => { this.allServices = res.Result || []; },
      error: (err: any) => console.error('❌ [Services API Error]', err)
    });
  }
  getSlots(): void {
    this.spaService.getSlots().subscribe({
      next: (res: any) => { this.allSlots = (res.Result || []).sort((a: any, b: any) => a.id - b.id); },
      error: (err: any) => console.error('❌ [Slots API Error]', err)
    });
  }
  getOffers(): void {
    this.spaService.getOffers().subscribe({
      next: (res: any) => { this.activeOffers = (res.Result || []).filter((o: any) => o.status === 'Active').length; },
      error: (err: any) => console.error('❌ [Offers API Error]', err)
    });
  }

  // ───────────────── LISTS FOR THE FORM ─────────────────
  // Only free slots can be chosen for a new booking.
  get availableSlots(): TimeSlot[] {
    return this.allSlots.filter(s => s.status === 'Available');
  }
  // Only staff who are currently available.
  get availableStaff(): StaffMember[] {
    return this.staffList.filter(s => s.isAvailable);
  }

  // ───────────────── FILTERED LIST ─────────────────
  get bookings(): Booking[] {
    const q = this.search.toLowerCase();
    return this.allBookings.filter(b =>
      (this.active === 'All' || b.status === this.active) &&
      (!q || b.customerName.toLowerCase().includes(q) || b.service.toLowerCase().includes(q)));
  }

  get counts() {
    const all = this.allBookings;
    return {
      total:     all.length,
      revenue:   all.filter(b => b.status !== 'Cancelled').reduce((a, b) => a + b.price, 0),
      completed: all.filter(b => b.status === 'Completed').length,
      pending:   all.filter(b => b.status === 'Pending').length,
      offers:    this.activeOffers,
    };
  }

  setActive(f: string): void { this.active = f; }
  cur(n: number): string { return formatCurrency(n, 'INR'); }
  filterLabel(f: string): string { return f === 'InProgress' ? 'In Progress' : f; }
  statusLabel(s: Booking['status']): string { return s === 'InProgress' ? 'In Progress' : s; }
  statusClass(s: Booking['status']): string {
    const m: Record<string, string> = { Confirmed: 'sage', InProgress: 'gold', Pending: 'amber', Cancelled: 'red', Completed: 'green' };
    return 'sp-badge ' + (m[s] || 'gray');
  }
  closeAdd(): void { this.showAdd = false; }

  // ───────────────── SET STATUS ─────────────────
  setStatus(b: Booking, status: Booking['status']): void {
    this.spaService.updateBooking(b.id, { status }).subscribe({
      next: () => { b.status = status; this.showToast(`${b.customerName} marked ${this.statusLabel(status)}`); },
      error: (err: any) => console.error('❌ [Booking Update Error]', err)
    });
  }

  // ───────────────── NEW BOOKING FORM HELPERS ─────────────────
  openAdd(): void {
    this.form = { customerName: '', service: '', price: 0, slotId: 0, time: '', staff: '' };
    // make sure the pickers are fresh
    this.getSlots();
    this.getServices();
    this.getStaff();
    this.showAdd = true;
  }

  // When a service is chosen, auto-fill its price.
  onServiceChange(): void {
    const svc = this.allServices.find(s => s.name === this.form.service);
    if (svc) this.form.price = svc.price;
  }

  // Pick a time slot from the available-slots grid.
  selectSlot(slot: TimeSlot): void {
    this.form.slotId = slot.id;
    this.form.time = `${slot.start}–${slot.end}`;
  }

  // ───────────────── SAVE ─────────────────
  save(): void {
    if (!this.form.customerName.trim()) { this.showToast('Enter a customer name'); return; }
    if (!this.form.service.trim())      { this.showToast('Please choose a service'); return; }
    if (!this.form.slotId)              { this.showToast('Please pick a time slot'); return; }

    const payload = {
      customerName: this.form.customerName.trim(),
      service: this.form.service,
      price: +this.form.price || 0,
      time: this.form.time,
      date: new Date().toISOString().slice(0, 10),
      status: 'Confirmed',
      avatarGrad: (this.allBookings.length % 5) + 1,
      staff: this.form.staff || '',
    };

    this.spaService.addBooking(payload).subscribe({
      next: (res: any) => {
        this.allBookings = [res.Result, ...this.allBookings];
        // Also book the chosen slot in Slot Management.
        this.bookSelectedSlot();
        this.showToast('Booking added');
        this.closeAdd();
      },
      error: (err: any) => console.error('❌ [Booking Add Error]', err)
    });
  }

  // Mark the picked slot as Booked (updates Slot Management too).
  private bookSelectedSlot(): void {
    const slot = this.allSlots.find(s => s.id === this.form.slotId);
    if (!slot) return;
    const patch = { status: 'Booked', customerName: this.form.customerName.trim(), serviceName: this.form.service, price: +this.form.price || 0 };
    this.spaService.updateSlot(slot.id, patch).subscribe({
      next: () => {
        slot.status = 'Booked';
        slot.customerName = patch.customerName;
        slot.serviceName = patch.serviceName;
        slot.price = patch.price;
      },
      error: (err: any) => console.error('❌ [Slot Update Error]', err)
    });
  }

  // ───────────────── DELETE ─────────────────
  remove(b: Booking): void {
    this.spaService.deleteBooking(b.id).subscribe({
      next: () => { this.allBookings = this.allBookings.filter(x => x.id !== b.id); this.showToast('Booking removed'); },
      error: (err: any) => console.error('❌ [Booking Delete Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
