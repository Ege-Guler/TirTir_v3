import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  transmission: 'otomatik' | 'manuel';
  fuelType: 'dizel' | 'benzin' | 'elektrik' | 'hibrit';
  seats: number;
  category: 'Otomobil' | 'SUV' | 'Ticari' | 'Park Alanı';
  owner: {
    uid: string
    email: string;
    phone: string;
    displayName: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly FEATURES = [
    'Air Conditioning',
    'GPS Navigation',
    'Bluetooth',
    'Backup Camera',
    'Parking Sensors',
    'Cruise Control',
    'Power Windows',
    'Power Locks',
    'Power Mirrors',
    'Keyless Entry',
    'Push Button Start',
    'Heated Seats',
    'Leather Seats',
    'Sunroof',
    'Premium Audio',
    'Apple CarPlay',
    'Android Auto',
    'WiFi Hotspot',
    'Towing Package',
    'Roof Rack',
    'Cargo Cover',
    'Trailer Hitch',
    'Bed Liner',
    'Tool Box'
  ];

  private cars: Car[] = [
    {
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
        email: 'jane@example.com',
        displayName: "dfasdf",
        phone: '555-555-5555'
      },
      location: {
        lat: 41.0122,
        lng: 28.9760,
        address: 'Istanbul, Turkey'
      },
      features: [
        'GPS Navigation',
        'Backup Camera',
        'Towing Package',
        'Bed Liner',
        'Tool Box'
      ]
    },
    {
      id: '2',
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
        email: 'jane@example.com',
        displayName: "dfasdf",
        phone: '555-555-5555'
      },
      location: {
        lat: 41.0122,
        lng: 28.9760,
        address: 'Istanbul, Turkey'
      },
      features: [
        'GPS Navigation',
        'Backup Camera',
        'Towing Package',
        'Bed Liner',
        'Tool Box'
      ]
    },
    {
      id: '3',
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
        email: 'jane@example.com',
        displayName: "dfasdf",
        phone: '555-555-5555'
      },
      location: {
        lat: 41.0122,
        lng: 28.9760,
        address: 'Istanbul, Turkey'
      },
      features: [
        'GPS Navigation',
        'Backup Camera',
        'Towing Package',
        'Bed Liner',
        'Tool Box'
      ]
    },

  ];

  getCars(): Observable<Car[]> {
    return of(this.cars);
  }

  getCarById(id: string): Observable<Car | undefined> {
    return of(this.cars.find(car => car.id === id));
  }

  getFeatures(): string[] {
    return this.FEATURES;
  }

  getCategories(): string[] {
    return ['Otomobil', 'SUV', 'Ticari', 'Park Alanı'];
  }

  getTransmissionTypes(): string[] {
    return ['otomatik', 'manuel'];
  }

  getFuelTypes(): string[] {
    return ['dizel', 'benzin', 'elektrik', 'hibrit'];
  }
}