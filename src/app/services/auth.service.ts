import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  login(email: string, password: string): void {
    // Simulate login - replace with actual API call
    const mockUser: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      phone: '+90 532 123 4567'
    };

    this.currentUserSubject.next(mockUser);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/account']);
  }

  register(userData: any): void {
    // Simulate registration - replace with actual API call
    const mockUser: User = {
      id: '1',
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone
    };

    this.currentUserSubject.next(mockUser);
    this.isAuthenticatedSubject.next(true);
    this.router.navigate(['/account']);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/']);
  }
}