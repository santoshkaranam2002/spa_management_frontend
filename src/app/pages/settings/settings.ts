import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { SpaService } from '../../services/spa.service';

interface Pref { key: string; label: string; desc: string; on: boolean; }

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── UI STATE ─────────────────
  toast = '';

  // ───────────────── BUSINESS PROFILE ─────────────────
  businessName = 'Serene Spa & Wellness';
  ownerName = 'Anjali Joshi';
  email = 'anjali@serenespa.com';
  phone = '+91 98001 11111';
  address = '42 Lotus Lane, Bengaluru';
  currency = 'INR';
  density: 'comfortable' | 'compact' = 'comfortable';

  // ───────────────── PREFERENCES ─────────────────
  prefs: Pref[] = [
    { key: 'bookingAlerts', label: 'New booking alerts', desc: 'Get notified when a customer books', on: true },
    { key: 'reviewAlerts', label: 'Review notifications', desc: 'Alert me about new reviews', on: true },
    { key: 'marketing', label: 'Marketing emails', desc: 'Tips and product updates', on: false },
    { key: 'autoConfirm', label: 'Auto-confirm bookings', desc: 'Confirm online bookings automatically', on: true },
    { key: 'showOffline', label: 'Show when offline', desc: 'Display offline status to customers', on: false },
  ];

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getSettings();
  }

  // ───────────────── GET ─────────────────
  getSettings(): void {
    this.spaService.getSettings().subscribe({
      next: (res: any) => {
        const s = (res.Result || [])[0];
        if (s) {
          this.businessName = s.businessName ?? this.businessName;
          this.ownerName = s.ownerName ?? this.ownerName;
          this.email = s.email ?? this.email;
          this.phone = s.phone ?? this.phone;
          this.address = s.address ?? this.address;
          this.currency = s.currency ?? this.currency;
          this.density = s.density ?? this.density;
        }
      },
      error: (err: any) => console.error('❌ [Settings API Error]', err)
    });
  }

  setCurrency(c: string): void { this.currency = c; }
  setDensity(d: 'comfortable' | 'compact'): void { this.density = d; }
  togglePref(key: string): void {
    this.prefs = this.prefs.map(p => p.key === key ? { ...p, on: !p.on } : p);
  }

  // ───────────────── SAVE ─────────────────
  save(): void {
    const payload = {
      businessName: this.businessName, ownerName: this.ownerName, email: this.email,
      phone: this.phone, address: this.address, currency: this.currency, density: this.density,
    };
    this.spaService.updateSetting(1, payload).subscribe({
      next: () => { this.showToast('Settings saved'); },
      error: (err: any) => console.error('❌ [Settings Update Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
