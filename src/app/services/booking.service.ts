import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where,doc, setDoc, deleteDoc, collectionGroup, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { Car } from './car.service';
import { catchError } from 'rxjs/operators';


export interface Booking {
  bookingId?: string;
  carId: string;
  car: Car;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'upcoming'; 
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private firestore: Firestore, private auth:Auth) {}

    async createBooking(booking: Booking): Promise<void> {
        
        const user = this.auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        const userBookingRef = collection(this.firestore, `users/${user.uid}/bookings`);
        const newBookingRef = doc(userBookingRef);
        booking.bookingId = String(newBookingRef.id);

        await setDoc(newBookingRef, booking);
      }

    getBookings(): Observable<Booking[]> {
      const user = this.auth.currentUser;
      if (!user) {
          throw new Error('User not authenticated');
      }
      const userBookingRef = collection(this.firestore, `users/${user.uid}/bookings`);
      const bookingQuery = query(userBookingRef);

      return from(
        getDocs(bookingQuery).then((snapshot) =>
          snapshot.docs.map((doc) => ({
            bookingId: doc.id,
            ...doc.data(),
          } as Booking))
      ));
      
    }
  
}