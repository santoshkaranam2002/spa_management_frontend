import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../layout/icon';
import { initials, formatCurrency, Conversation, ChatMessage } from '../../core/data';
import { SpaService } from '../../services/spa.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements OnInit {

  constructor(private spaService: SpaService) {}

  initials = initials;

  // ───────────────── DATA (from API) ─────────────────
  conversations: Conversation[] = [];
  activeId = 0;
  draft = '';
  mobileThread = false;
  messages: ChatMessage[] = [];

  // ───────────────── INIT ─────────────────
  ngOnInit(): void {
    this.getConversations();
  }

  // ───────────────── GET ALL ─────────────────
  getConversations(): void {
    this.spaService.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res.Result || [];
        if (this.conversations.length) {
          this.activeId = this.conversations[0].id;
          this.buildThread(this.conversations[0]);
        }
      },
      error: (err: any) => console.error('❌ [Conversations API Error]', err)
    });
  }

  get active(): Conversation {
    return this.conversations.find(c => c.id === this.activeId) ?? this.conversations[0];
  }

  cur(n: number): string { return formatCurrency(n, 'INR'); }

  // Build the thread from the conversation's own last message (from the API).
  private buildThread(c: Conversation): void {
    this.messages = c && c.lastMessage
      ? [{ id: 1, from: 'Them', text: c.lastMessage, time: c.time, type: 'text' }]
      : [];
  }

  // ───────────────── SELECT ─────────────────
  select(c: Conversation): void {
    this.activeId = c.id;
    this.mobileThread = true;
    this.buildThread(c);
    if (c.unreadCount) {
      this.spaService.updateConversation(c.id, { unreadCount: 0 }).subscribe({
        next: () => { c.unreadCount = 0; },
        error: (err: any) => console.error('❌ [Conversation Update Error]', err)
      });
    }
  }
  backToList(): void { this.mobileThread = false; }

  // ───────────────── SEND ─────────────────
  send(): void {
    const t = this.draft.trim();
    if (!t) return;
    const id = Math.max(0, ...this.messages.map(m => m.id)) + 1;
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    this.messages = [...this.messages, { id, from: 'Me', text: t, time: now, type: 'text' }];
    this.draft = '';
  }

  confirmSlot(s: { time: string }): void {
    const id = Math.max(0, ...this.messages.map(m => m.id)) + 1;
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    this.messages = [...this.messages, { id, from: 'Me', text: `Confirmed ${s.time} ✅`, time: now, type: 'text' }];
  }
}
