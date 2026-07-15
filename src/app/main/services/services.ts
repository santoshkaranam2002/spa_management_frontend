import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { formatCurrency, Service, ServicePackage } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── DATA ─────────────────
  allServices: Service[] = [];
  allPackages: ServicePackage[] = [];

  // ───────────────── UI STATE ─────────────────
  tab: 'services' | 'packages' = 'services';
  category = 'All';
  search = '';
  toast = '';
  showEdit = false;
  editing: Service | null = null;

  // ───────────────── FORM ─────────────────
  form = { name: '', category: 'Facial', price: 0, durationMin: 30, description: '' };

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getServices();
    this.getPackages();
  }

  // ───────────────── GET ─────────────────
  getServices(): void {
    this.spaService.getServices().subscribe({
      next: (res: any) => { this.allServices = res.Result || []; },
      error: (err: any) => console.error('❌ [Services API Error]', err)
    });
  }
  getPackages(): void {
    this.spaService.getPackages().subscribe({
      next: (res: any) => { this.allPackages = res.Result || []; },
      error: (err: any) => console.error('❌ [Packages API Error]', err)
    });
  }

  // ───────────────── FILTERED LISTS ─────────────────
  get categories(): string[] {
    return ['All', ...Array.from(new Set(this.allServices.map(s => s.category)))];
  }
  get services(): Service[] {
    const q = this.search.toLowerCase();
    return this.allServices.filter(s =>
      (this.category === 'All' || s.category === this.category) &&
      (!q || s.name.toLowerCase().includes(q)));
  }
  get packages(): ServicePackage[] { return this.allPackages; }

  setTab(t: 'services' | 'packages'): void { this.tab = t; }
  setCategory(c: string): void { this.category = c; }
  cur(n: number): string { return formatCurrency(n, 'INR'); }
  saveAmount(p: { price: number; originalPrice: number }): number { return p.originalPrice - p.price; }
  closeEdit(): void { this.showEdit = false; }

  // ───────────────── TOGGLES ─────────────────
  toggleActive(s: Service): void {
    const next = !s.isActive;
    this.spaService.updateService(s.id, { isActive: next }).subscribe({
      next: () => { s.isActive = next; this.showToast(`${s.name} ${next ? 'activated' : 'paused'}`); },
      error: (err: any) => console.error('❌ [Service Update Error]', err)
    });
  }
  togglePackage(id: number): void {
    const pkg = this.allPackages.find(p => p.id === id);
    if (!pkg) return;
    const next = !pkg.isActive;
    this.spaService.updatePackage(id, { isActive: next }).subscribe({
      next: () => { pkg.isActive = next; },
      error: (err: any) => console.error('❌ [Package Update Error]', err)
    });
  }

  // ───────────────── ADD / EDIT ─────────────────
  openNew(): void {
    this.editing = null;
    this.form = { name: '', category: 'Facial', price: 0, durationMin: 30, description: '' };
    this.showEdit = true;
  }
  openEdit(s: Service): void {
    this.editing = s;
    this.form = { name: s.name, category: s.category, price: s.price, durationMin: s.durationMin, description: s.description };
    this.showEdit = true;
  }

  // ───────────────── SAVE (ADD + UPDATE) ─────────────────
  save(): void {
    if (!this.form.name.trim()) { this.showToast('Enter a service name'); return; }

    if (this.editing) {
      const id = this.editing.id;
      const payload = {
        name: this.form.name.trim(), category: this.form.category,
        price: +this.form.price || 0, durationMin: +this.form.durationMin || 0, description: this.form.description
      };
      this.spaService.updateService(id, payload).subscribe({
        next: () => {
          this.allServices = this.allServices.map(x => x.id === id ? { ...x, ...payload } : x);
          this.showToast('Service updated');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Service Update Error]', err)
      });
    } else {
      const payload = {
        name: this.form.name.trim(), category: this.form.category, description: this.form.description,
        price: +this.form.price || 0, durationMin: +this.form.durationMin || 0, bufferMin: 10,
        isActive: true, isFeatured: false, isPopular: false, for: 'All', tags: [], bookings: 0,
      };
      this.spaService.addService(payload).subscribe({
        next: (res: any) => {
          this.allServices = [...this.allServices, res.Result];
          this.showToast('Service added');
          this.closeEdit();
        },
        error: (err: any) => console.error('❌ [Service Add Error]', err)
      });
    }
  }

  // ───────────────── DELETE ─────────────────
  remove(s: Service): void {
    this.spaService.deleteService(s.id).subscribe({
      next: () => {
        this.allServices = this.allServices.filter(x => x.id !== s.id);
        this.showToast(`${s.name} removed`);
      },
      error: (err: any) => console.error('❌ [Service Delete Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
