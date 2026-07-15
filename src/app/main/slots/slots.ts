import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatCurrency, TimeSlot, DaySchedule, SlotStatus } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slots.html',
  styleUrl: './slots.scss',
})
export class SlotsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── DATA ─────────────────
  slots: TimeSlot[] = [];
  schedule: (DaySchedule & { id?: number })[] = [];
  toast = '';

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getSlots();
    this.getSchedule();
  }

  // ───────────────── GET ─────────────────
  getSlots(): void {
    this.spaService.getSlots().subscribe({
      next: (res: any) => { this.slots = (res.Result || []).sort((a: any, b: any) => a.id - b.id); },
      error: (err: any) => console.error('❌ [Slots API Error]', err)
    });
  }
  getSchedule(): void {
    this.spaService.getSchedule().subscribe({
      next: (res: any) => { this.schedule = (res.Result || []).sort((a: any, b: any) => a.id - b.id); },
      error: (err: any) => console.error('❌ [Schedule API Error]', err)
    });
  }

  // ───────────────── COUNTS ─────────────────
  get counts() {
    const s = this.slots;
    return {
      available:  s.filter(x => x.status === 'Available').length,
      booked:     s.filter(x => x.status === 'Booked').length,
      inprogress: s.filter(x => x.status === 'InProgress').length,
      blocked:    s.filter(x => x.status === 'Blocked').length,
    };
  }

  cur(n: number): string { return formatCurrency(n, 'INR'); }
  slotClass(s: SlotStatus): string { return 'slot slot--' + s.toLowerCase(); }
  slotLabel(s: SlotStatus): string { return s === 'InProgress' ? 'In progress' : s; }

  // ───────────────── TOGGLE DAY ─────────────────
  toggleDay(day: string): void {
    const d: any = this.schedule.find(x => x.day === day);
    if (!d || !d.id) return;
    const next = !d.isActive;
    this.spaService.updateSchedule(d.id, { isActive: next }).subscribe({
      next: () => { d.isActive = next; },
      error: (err: any) => console.error('❌ [Schedule Update Error]', err)
    });
  }

  // ───────────────── BLOCK / UNBLOCK SLOT ─────────────────
  cycleSlot(slot: TimeSlot): void {
    if (slot.status === 'Booked' || slot.status === 'InProgress') { this.showToast('Booked slots can’t be blocked'); return; }
    const next: SlotStatus = slot.status === 'Available' ? 'Blocked' : 'Available';
    this.spaService.updateSlot(slot.id, { status: next }).subscribe({
      next: () => { slot.status = next; this.showToast(`Slot ${slot.start} marked ${next}`); },
      error: (err: any) => console.error('❌ [Slot Update Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2200); }
}
