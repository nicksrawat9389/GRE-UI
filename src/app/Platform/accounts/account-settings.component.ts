import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, JwtPayload } from '../../Auth/auth/auth.service';

@Component({
  selector: 'app-account-settings',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
private authService = inject(AuthService);
  user:JwtPayload | null = null;
  

  constructor() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogoutClick(){
    this.authService.logout();
  }
}
