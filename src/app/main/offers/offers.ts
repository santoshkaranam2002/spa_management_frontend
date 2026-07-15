import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { Offer, OfferStatus } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './offers.html',
  styleUrl: './offers.scss',
})
export class OffersComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  // ───────────────── DATA ─────────────────
  allOffers: Offer[] = [];

  // ───────────────── FILTER / TOAST ─────────────────
  filter: 'All' | 'Coupon' | 'Banner' | 'Offer' = 'All';
  toast = '';

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getOffers();
  }

  // ───────────────── GET ALL ─────────────────
  getOffers(): void {
    this.spaService.getOffers().subscribe({
      next: (res: any) => {
        this.allOffers = res.Result || [];
      },
      error: (err: any) => {
        console.error('❌ [Offers API Error]', err);
      }
    });
  }

  // ───────────────── FILTERED LIST ─────────────────
  get offers(): Offer[] {
    return this.allOffers.filter(o => this.filter === 'All' || o.type === this.filter);
  }

  get counts() {
    const all = this.allOffers;
    return {
      active:     all.filter(o => o.status === 'Active').length,
      scheduled:  all.filter(o => o.status === 'Scheduled').length,
      totalUsage: all.reduce((a, o) => a + o.usage, 0),
      coupons:    all.filter(o => o.type === 'Coupon').length,
    };
  }

  setFilter(f: 'All' | 'Coupon' | 'Banner' | 'Offer'): void {
    this.filter = f;
  }

  statusClass(s: OfferStatus): string {
    const m: Record<string, string> = { Active: 'green', Scheduled: 'info', Ended: 'gray' };
    return 'sp-badge ' + (m[s] || 'gray');
  }
  typeClass(t: string): string {
    const m: Record<string, string> = { Coupon: 'plum', Banner: 'gold', Offer: 'rose' };
    return 'sp-badge no-dot ' + (m[t] || 'plum');
  }

  // ───────────────── TOGGLE STATUS ─────────────────
  toggleStatus(o: Offer): void {
    const next: OfferStatus = o.status === 'Active' ? 'Ended' : 'Active';
    this.spaService.updateOffer(o.id, { status: next }).subscribe({
      next: () => {
        o.status = next;
        this.showToast(`${o.name} ${next === 'Active' ? 'activated' : 'ended'}`);
      },
      error: (err: any) => console.error('❌ [Offer Update Error]', err)
    });
  }

  copyCode(o: Offer): void {
    if (o.couponCode && navigator.clipboard) navigator.clipboard.writeText(o.couponCode).catch(() => {});
    this.showToast(`Copied ${o.couponCode}`);
  }

  // ───────────────── DELETE ─────────────────
  remove(o: Offer): void {
    this.spaService.deleteOffer(o.id).subscribe({
      next: () => {
        this.allOffers = this.allOffers.filter(x => x.id !== o.id);
        this.showToast(`${o.name} removed`);
      },
      error: (err: any) => console.error('❌ [Offer Delete Error]', err)
    });
  }

  // ───────────────── TOAST ─────────────────
  showToast(m: string): void {
    this.toast = m;
    setTimeout(() => this.toast = '', 2200);
  }
}
