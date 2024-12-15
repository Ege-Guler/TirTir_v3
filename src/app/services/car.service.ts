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
    'Klima',
    'GPS Navigasyon',
    'Bluetooth',
    'Geri Görüş Kamerası',
    'Park Sensörleri',
    'Hız Sabitleyici',
    'Elektrikli Camlar',
    'Merkezi Kilit Sistemi',
    'Elektrikli Aynalar',
    'Anahtarsız Giriş',
    'Düğmeyle Çalıştırma',
    'Isıtmalı Koltuklar',
    'Deri Koltuklar',
    'Sunroof',
    'Premium Ses Sistemi',
    'Apple CarPlay',
    'Android Auto',
    'WiFi Hotspot',
    'Çeki Paketi',
    'Tavan Rafı',
    'Bagaj Kapağı',
    'Römork Kancası',
    'Koltuk Koruyucu',
    'Alet Kutusu'
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