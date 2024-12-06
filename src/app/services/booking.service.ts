import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Car } from './car.service';

export interface Booking {
  carId: string;
  car: Car;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'cancelled' | 'completed' | 'upcoming'; 
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
    createBooking(booking: Booking): Observable<void> {
        // Simulate API call
        console.log('Creating booking:', booking);
        return of(void 0);
      }
  private mockBookings: Booking[] = [
    {
      carId: '1',
      car: {
        id: '1',
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        price: 120,
        mileage: 15000,
        transmission: 'otomatik',
        fuelType: 'dizel',
        seats: 5,
        category: 'Otomobil',
        images: ['https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=800'],
        owner: {
            uid: 'Jane Smith',
          displayName: 'John Doe',
          phone: '+90 532 123 4567',
          email: 'john@example.com',
        },
        location: {
          lat: 41.0122,
          lng: 28.9760,
          address: 'Istanbul, Turkey'
        },
        features: [
          'GPS Navigation',
          'Backup Camera',
          'Towing Package'
        ]
      },
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      totalPrice: 600,
      status: 'active'
    },
    {
        carId: '2',
        car: {
          id: '1',
          make: 'Ford',
          model: 'F-150',
          year: 2023,
          price: 120,
          mileage: 15000,
          transmission: 'otomatik',
          fuelType: 'dizel',
          seats: 5,
          category: 'Otomobil',
          images: ['https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=800'],
          owner: {
              uid: 'Jane Smith',
            displayName: 'John Doe',
            phone: '+90 532 123 4567',
            email: 'john@example.com',
          },
          location: {
            lat: 41.0122,
            lng: 28.9760,
            address: 'Istanbul, Turkey'
          },
          features: [
            'GPS Navigation',
            'Backup Camera',
            'Towing Package'
          ]
        },
        startDate: '2024-03-15',
        endDate: '2024-03-20',
        totalPrice: 600,
        status: 'active'
      },
  ];

  getBookings(): Observable<Booking[]> {
    return of(this.mockBookings);
  }

  getBookingById(id: string): Observable<Booking | undefined> {
    return of(this.mockBookings.find(booking => booking.carId === id));
  }
}