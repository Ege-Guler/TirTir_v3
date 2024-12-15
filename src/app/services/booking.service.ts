import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where,doc, setDoc, deleteDoc, collectionGroup, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { Car } from './car.service';
import { catchError } from 'rxjs/operators';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.service';

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
  constructor(private firestore: Firestore, private auth:Auth, private transactionService:TransactionService) {}

    async createBooking(booking: Booking): Promise<void> {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
    
      const userBookingRef = collection(this.firestore, `users/${user.uid}/bookings`);
      const newBookingRef = doc(userBookingRef);
      booking.bookingId = String(newBookingRef.id);
    
      // Save booking to Firestore
      await setDoc(newBookingRef, booking);
    
      // Create a corresponding transaction
      const transaction: Transaction = {
        transactionName: booking.car.year +  ' ' + booking.car.make + ' ' + booking.car.model,
        carId: booking.carId,
        ownerName: booking.car.owner.displayName,
        renterName: user.displayName,
        renterId: user.uid,
        ownerId: booking.car.owner.uid,
        totalAmount: booking.totalPrice,
        startDate: booking.startDate,
        endDate: booking.endDate,
      };
    
      try {
        await this.transactionService.createTransaction(transaction);
        console.log('Transaction created successfully for booking:', booking.bookingId);
      } catch (error) {
        console.error('Failed to create transaction for booking:', error);
        throw error;
      }
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
    getAllBookedCarIds(): Observable<string[]> {
      const bookingQuery = collectionGroup(this.firestore, 'bookings');
    
      return from(
        getDocs(bookingQuery).then((snapshot) => {
          // Use bracket notation to access 'carId'
          const bookedCarIds = snapshot.docs.map((doc) => doc.data()['carId']);
          console.log('Booked Car IDs:', bookedCarIds); // Debug log
          return bookedCarIds;
        })
      ).pipe(
        catchError((error) => {
          console.error('Error fetching booked car IDs:', error); // Log error
          return of([]); // Return an empty array in case of an error
        })
      );
    }
    
    
    
    
    
}