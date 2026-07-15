import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { initials, formatCurrency, StaffMember, StaffRole } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})
export class StaffComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA ─────────────────
  allStaff: StaffMember[] = [];

  // ───────────────── UI STATE ─────────────────
  toast = '';
  showEdit = false;
  editing: StaffMember | null = null;

  // ───────────────── FORM ─────────────────
  form = { name: '', role: 'Therapist' as StaffRole, email: '', phone: '', skills: '' };

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getStaff();
  }

  // ───────────────── GET ALL ─────────────────
  getStaff(): void {
    this.spaService.getStaff().subscribe({
      next: (res: any) => { this.allStaff = res.Result || []; },
      error: (err: any) => console.error('❌ [Staff API Error]', err)
    });
  }

  get staff(): StaffMember[] { return this.allStaff; }

  get counts() {
    const all = this.allStaff;
    return {
      total:     all.length,
      available: all.filter(s => s.isAvailable).length,
      bookings:  all.reduce((a, s) => a + s.bookingsToday, 0),
      earnings:  all.reduce((a, s) => a + s.earningsToday, 0),
    };
  }

  cur(n: number): string { return formatCurrency(n, 'INR'); }
  roleClass(r: StaffRole): string {
    const m: Record<string, string> = { Manager: 'plum', Senior: 'gold', Therapist: 'sage', Trainee: 'info' };
    return 'sp-badge no-dot ' + (m[r] || 'plum');
  }
  stars(n: number): boolean[] { return Array(5).fill(0).map((_, i) => i < n); }
  closeEdit(): void { this.showEdit = false; }

  // ───────────────── TOGGLE AVAILABILITY ─────────────────
  toggleAvail(s: StaffMember): void {
    const next = !s.isAvailable;
    this.spaService.updateStaff(s.id, { isAvailable: next }).subscribe({
      next: () => { s.isAvailable = next; },
      error: (err: any) => console.error('❌ [Staff Update Error]', err)
    });
  }

  // ───────────────── ADD / EDIT ─────────────────
  openNew(): void {
    this.editing = null;
    this.form = { name: '', role: 'Therapist', email: '', phone: '', skills: '' };
    this.showEdit = true;
  }
  openEdit(s: StaffMember): void {
    this.editing = s;
    this.form = { name: s.name, role: s.role, email: s.email, phone: s.phone, skills: s.skills.join(', ') };
    this.showEdit = true;
  }

  // ───────────────── SAVE (ADD + UPDATE) ─────────────────
  save(): void {
    if (!this.form.name.trim()) { this.showToast('Enter a name'); return; }
    const skills = this.form.skills.split(',').map(s => s.trim()).filter(Boolean);

    if (this.editing) {
      const id = this.editing.id;
      const payload = { name: this.form.name.trim(), role: this.form.role, email: this.form.email, phone: this.form.phone, skills };
      this.spaService.updateStaff(id, payload).subscribe({
        next: () => {
          this.allStaff = this.allStaff.map(x => x.id === id ? { ...x, ...payload } : x);
          this.showToast('Staff updated');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Staff Update Error]', err)
      });
    } else {
      const payload = {
        name: this.form.name.trim(), role: this.form.role, email: this.form.email, phone: this.form.phone, skills,
        isAvailable: true, bookingsToday: 0, earningsToday: 0, avatarGrad: (this.allStaff.length % 5) + 1, rating: 5,
      };
      this.spaService.addStaff(payload).subscribe({
        next: (res: any) => {
          this.allStaff = [...this.allStaff, res.Result];
          this.showToast('Staff added');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Staff Add Error]', err)
      });
    }
  }

  // ───────────────── DELETE ─────────────────
  remove(s: StaffMember): void {
    this.spaService.deleteStaff(s.id).subscribe({
      next: () => {
        this.allStaff = this.allStaff.filter(x => x.id !== s.id);
        this.showToast(`${s.name} removed`);
      },
      error: (err: any) => console.error('❌ [Staff Delete Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
