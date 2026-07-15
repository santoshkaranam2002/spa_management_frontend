import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { initials, formatCurrency, Customer } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class CustomersComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA ─────────────────
  allCustomers: Customer[] = [];

  // ───────────────── UI STATE ─────────────────
  search = '';
  onlyLoyal = false;
  toast = '';
  selected: Customer | null = null;
  showEdit = false;
  editing: Customer | null = null;

  // ───────────────── FORM ─────────────────
  form = { name: '', phone: '', email: '', notes: '' };

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getCustomers();
  }

  // ───────────────── GET ALL ─────────────────
  getCustomers(): void {
    this.spaService.getCustomers().subscribe({
      next: (res: any) => { this.allCustomers = res.Result || []; },
      error: (err: any) => console.error('❌ [Customers API Error]', err)
    });
  }

  // ───────────────── FILTERED LIST ─────────────────
  get customers(): Customer[] {
    const q = this.search.toLowerCase();
    return this.allCustomers.filter(c =>
      (!this.onlyLoyal || c.isLoyal) &&
      (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)));
  }

  get counts() {
    const all = this.allCustomers;
    return {
      total:   all.length,
      loyal:   all.filter(c => c.isLoyal).length,
      revenue: all.reduce((a, c) => a + c.totalSpent, 0),
      visits:  all.reduce((a, c) => a + c.totalVisits, 0),
    };
  }

  cur(n: number): string { return formatCurrency(n, 'INR'); }
  toggleLoyalFilter(): void { this.onlyLoyal = !this.onlyLoyal; }
  openView(c: Customer): void { this.selected = c; }
  closeView(): void { this.selected = null; }
  closeEdit(): void { this.showEdit = false; }

  // ───────────────── ADD / EDIT ─────────────────
  openNew(): void {
    this.editing = null;
    this.form = { name: '', phone: '', email: '', notes: '' };
    this.showEdit = true;
  }
  openEdit(c: Customer): void {
    this.editing = c;
    this.form = { name: c.name, phone: c.phone, email: c.email, notes: c.notes || '' };
    this.showEdit = true;
  }

  // ───────────────── SAVE (ADD + UPDATE) ─────────────────
  save(): void {
    if (!this.form.name.trim()) { this.showToast('Enter a name'); return; }

    if (this.editing) {
      const id = this.editing.id;
      const payload = { name: this.form.name.trim(), phone: this.form.phone, email: this.form.email, notes: this.form.notes };
      this.spaService.updateCustomer(id, payload).subscribe({
        next: () => {
          this.allCustomers = this.allCustomers.map(x => x.id === id ? { ...x, ...payload } : x);
          this.showToast('Customer updated');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Customer Update Error]', err)
      });
    } else {
      const payload = {
        name: this.form.name.trim(), phone: this.form.phone, email: this.form.email, notes: this.form.notes,
        totalVisits: 0, totalSpent: 0, lastVisit: new Date().toISOString().slice(0, 10),
        isLoyal: false, avatarGrad: (this.allCustomers.length % 5) + 1, gender: 'Female',
      };
      this.spaService.addCustomer(payload).subscribe({
        next: (res: any) => {
          this.allCustomers = [res.Result, ...this.allCustomers];
          this.showToast('Customer added');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Customer Add Error]', err)
      });
    }
  }

  // ───────────────── TOGGLE LOYAL ─────────────────
  toggleLoyal(c: Customer): void {
    const next = !c.isLoyal;
    this.spaService.updateCustomer(c.id, { isLoyal: next }).subscribe({
      next: () => { c.isLoyal = next; },
      error: (err: any) => console.error('❌ [Customer Update Error]', err)
    });
  }

  // ───────────────── DELETE ─────────────────
  remove(c: Customer): void {
    this.spaService.deleteCustomer(c.id).subscribe({
      next: () => {
        this.allCustomers = this.allCustomers.filter(x => x.id !== c.id);
        this.selected = null;
        this.showToast(`${c.name} removed`);
      },
      error: (err: any) => console.error('❌ [Customer Delete Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
