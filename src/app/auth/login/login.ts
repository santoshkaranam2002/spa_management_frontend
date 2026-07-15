import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // ── form state (design only — no real auth) ──
  email = '';
  password = '';
  showPassword = false;
  rememberMe = true;

  constructor(private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Demo sign-in — any credentials work. Wire your API here later.
  signIn(): void {
    this.router.navigate(['/dashboard']);
  }
}