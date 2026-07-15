import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { initials, Review } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class ReviewsComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA ─────────────────
  allReviews: Review[] = [];

  // ───────────────── UI STATE ─────────────────
  filter = 0;               // 0 = all
  toast = '';
  replyingTo: Review | null = null;
  replyText = '';

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getReviews();
  }

  // ───────────────── GET ALL ─────────────────
  getReviews(): void {
    this.spaService.getReviews().subscribe({
      next: (res: any) => { this.allReviews = res.Result || []; },
      error: (err: any) => console.error('❌ [Reviews API Error]', err)
    });
  }

  get reviews(): Review[] {
    return this.allReviews.filter(r => this.filter === 0 || r.rating === this.filter);
  }

  get stats() {
    const all = this.allReviews;
    const total = all.length;
    const avg = total ? (all.reduce((a, r) => a + r.rating, 0) / total) : 0;
    return {
      total,
      avg: avg.toFixed(1),
      replied: all.filter(r => r.isReplied).length,
      fiveStar: all.filter(r => r.rating === 5).length,
    };
  }

  setFilter(n: number): void { this.filter = n; }
  starArr(n: number): boolean[] { return Array(5).fill(0).map((_, i) => i < n); }

  // ───────────────── REPLY ─────────────────
  openReply(r: Review): void { this.replyingTo = r; this.replyText = ''; }
  closeReply(): void { this.replyingTo = null; }

  sendReply(): void {
    const r = this.replyingTo;
    if (!r) return;
    this.spaService.updateReview(r.id, { isReplied: true }).subscribe({
      next: () => {
        r.isReplied = true;
        this.replyingTo = null;
        this.showToast('Reply sent');
      },
      error: (err: any) => console.error('❌ [Review Update Error]', err)
    });
  }

  showToast(m: string): void { this.toast = m; setTimeout(() => this.toast = '', 2400); }
}
