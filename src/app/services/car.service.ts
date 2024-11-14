import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  transmission: 'automatic' | 'manual';
  fuelType: 'diesel' | 'gasoline' | 'electric' | 'hybrid';
  seats: number;
  category: 'truck' | 'van' | 'pickup';
  owner: {
    name: string;
    phone: string;
    email: string;
    rating: number;
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
      transmission: 'automatic',
      fuelType: 'diesel',
      seats: 5,
      category: 'pickup',
      image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'John Doe',
        phone: '+90 532 123 4567',
        email: 'john@example.com',
        rating: 4.8
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
      make: 'Mercedes-Benz',
      model: 'Actros',
      year: 2022,
      price: 250,
      mileage: 25000,
      transmission: 'automatic',
      fuelType: 'diesel',
      seats: 2,
      category: 'truck',
      image: 'https://images.unsplash.com/photo-1586191582056-b5d6b911dd93?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Jane Smith',
        phone: '+90 533 456 7890',
        email: 'jane@example.com',
        rating: 4.9
      },
      location: {
        lat: 41.0255,
        lng: 28.9742,
        address: 'Istanbul, Turkey'
      },
      features: [
        'Air Conditioning',
        'GPS Navigation',
        'Bluetooth',
        'Power Windows',
        'Cruise Control'
      ]
    },
    {
      id: '3',
      make: 'Volkswagen',
      model: 'Crafter',
      year: 2023,
      price: 140,
      mileage: 18000,
      transmission: 'manual',
      fuelType: 'diesel',
      seats: 3,
      category: 'van',
      image: 'https://images.unsplash.com/photo-1632933164873-6c5fd8386c5f?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Mike Johnson',
        phone: '+90 534 789 0123',
        email: 'mike@example.com',
        rating: 4.7
      },
      location: {
        lat: 41.0370,
        lng: 28.9833,
        address: 'Istanbul, Turkey'
      },
      features: [
        'Backup Camera',
        'Parking Sensors',
        'Bluetooth',
        'Power Locks',
        'Cargo Cover'
      ]
    },
    {
      id: '4',
      make: 'Volvo',
      model: 'FH16',
      year: 2023,
      price: 280,
      mileage: 12000,
      transmission: 'automatic',
      fuelType: 'diesel',
      seats: 2,
      category: 'truck',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Sarah Wilson',
        phone: '+90 535 234 5678',
        email: 'sarah@example.com',
        rating: 4.9
      },
      location: {
        lat: 41.0442,
        lng: 28.9718,
        address: 'Istanbul, Turkey'
      },
      features: [
        'GPS Navigation',
        'Premium Audio',
        'Bluetooth',
        'Power Windows',
        'Cruise Control'
      ]
    },
    {
      id: '5',
      make: 'Toyota',
      model: 'Hilux',
      year: 2022,
      price: 170,
      mileage: 28000,
      transmission: 'manual',
      fuelType: 'diesel',
      seats: 5,
      category: 'pickup',
      image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'David Brown',
        phone: '+90 536 345 6789',
        email: 'david@example.com',
        rating: 4.8
      },
      location: {
        lat: 41.0529,
        lng: 28.9948,
        address: 'Istanbul, Turkey'
      },
      features: [
        'Towing Package',
        'Bed Liner',
        'Tool Box',
        'Backup Camera',
        'Bluetooth'
      ]
    },
    {
      id: '6',
      make: 'Scania',
      model: 'R500',
      year: 2023,
      price: 260,
      mileage: 20000,
      transmission: 'automatic',
      fuelType: 'diesel',
      seats: 2,
      category: 'truck',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Emma Davis',
        phone: '+90 537 456 7890',
        email: 'emma@example.com',
        rating: 4.9
      },
      location: {
        lat: 41.0610,
        lng: 28.9892,
        address: 'Istanbul, Turkey'
      },
      features: [
        'GPS Navigation',
        'Premium Audio',
        'Air Conditioning',
        'Power Windows',
        'Cruise Control'
      ]
    },
    {
      id: '7',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      price: 130,
      mileage: 32000,
      transmission: 'manual',
      fuelType: 'diesel',
      seats: 3,
      category: 'van',
      image: 'https://images.unsplash.com/photo-1632933164873-6c5fd8386c5f?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Alex Turner',
        phone: '+90 538 567 8901',
        email: 'alex@example.com',
        rating: 4.7
      },
      location: {
        lat: 41.0712,
        lng: 28.9803,
        address: 'Istanbul, Turkey'
      },
      features: [
        'Backup Camera',
        'Parking Sensors',
        'Bluetooth',
        'Power Locks',
        'Cargo Cover'
      ]
    },
    {
      id: '8',
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2023,
      price: 180,
      mileage: 22000,
      transmission: 'automatic',
      fuelType: 'gasoline',
      seats: 5,
      category: 'pickup',
      image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=800',
      owner: {
        name: 'Oliver White',
        phone: '+90 539 678 9012',
        email: 'oliver@example.com',
        rating: 4.8
      },
      location: {
        lat: 41.0819,
        lng: 28.9870,
        address: 'Istanbul, Turkey'
      },
      features: [
        'Towing Package',
        'Bed Liner',
        'Tool Box',
        'GPS Navigation',
        'Bluetooth'
      ]
    }
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
    return ['truck', 'van', 'pickup'];
  }

  getTransmissionTypes(): string[] {
    return ['automatic', 'manual'];
  }

  getFuelTypes(): string[] {
    return ['diesel', 'gasoline', 'electric', 'hybrid'];
  }
}