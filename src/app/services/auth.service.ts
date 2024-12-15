import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastLogin: [Date, Date];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  // Login Method
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;

      // Retrieve user details from Firestore
      const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const user = userDoc.data() as User;

        const now = new Date();
        let updatedLastLogin: [Date, Date];

        if (user.lastLogin) {
          updatedLastLogin = [now, user.lastLogin[0]];
        } else {
          updatedLastLogin = [now, now];
        }

        // Update Firestore
        await updateDoc(userDocRef, { lastLogin: updatedLastLogin });

        // Update local user state
        this.currentUserSubject.next({ ...user, lastLogin: updatedLastLogin });
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/account']);
      } else {
        throw new Error('User data not found in Firestore');
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred during login';
      console.error('Login failed:', error);
      alert('Login failed: ' + errorMessage);
    }
  }

  // Register Method
  async register(userData: { firstName: string; lastName: string; email: string; phone: string; password: string }): Promise<void> {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      // Save user data to Firestore
      const now = new Date();
      const user: User = {
        id: firebaseUser.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: firebaseUser.email ?? '',
        phone: userData.phone,
        lastLogin: [now, now], // Init both indexes with reg date
      };

      const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      await setDoc(userDocRef, user);

      // Update current user state
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      this.router.navigate(['/account']);
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred during registration';
      console.error('Registration failed:', error);
      alert('Registration failed: ' + errorMessage);
    }
  }

  // Logout Method
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/']);
    } catch (error) {
      const errorMessage = (error as Error).message || 'An unknown error occurred during logout';
      console.error('Logout failed:', error);
      alert('Logout failed: ' + errorMessage);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  getPreviousLoginDate(): string | null {
    const currentUser = this.currentUserSubject.value;
  
    if (currentUser && currentUser.lastLogin[1]) {
      const previousLoginDate = currentUser.lastLogin[1];
  
      return previousLoginDate.toLocaleString('tr-TR', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long',   
        day: 'numeric',  
        hour: 'numeric', 
        minute: '2-digit',
      });
    }
  
    return null;
  }
  

  
}
