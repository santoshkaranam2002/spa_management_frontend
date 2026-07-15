import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, HeaderComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  mobileOpen = signal(false);
  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }
}
