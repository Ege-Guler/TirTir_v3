import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  currentUser$: Observable<User | null>;
  lastLogin: string | null;
  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;

    this.lastLogin = this.authService.getPreviousLoginDate();
  }


}