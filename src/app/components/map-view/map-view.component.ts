import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../services/car.service';
import { CarCardComponent } from '../car-card/car-card.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, CarCardComponent],
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
  @Input() cars: Car[] = [];
  
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private defaultLocation = { lat: 41.0082, lng: 28.9784 }; // Istanbul
  private darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  private lightLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  showNearestCars = false;
  selectedCar?: Car;
  nearestCars: Car[] = [];

  ngOnInit() {
    this.initMapWithUserLocation();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private async initMapWithUserLocation() {
    try {
      const position = await this.getCurrentPosition();
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.initMap(userLocation);
    } catch (error) {
      console.warn('Could not get user location:', error);
      this.initMap(this.defaultLocation);
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  private initMap(location: { lat: number; lng: number }) {
    // Create map instance with dark layer as default
    this.map = L.map('map', {
      center: [location.lat, location.lng],
      zoom: 13,
      zoomControl: false, // We'll add zoom control manually
      layers: [this.darkLayer] // Set dark layer as default
    });

    // Add layer control to bottom left next to zoom
    const baseMaps = {
      "Dark": this.darkLayer,
      "Light": this.lightLayer
    };

    // Add zoom control to bottom left
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);

    // Add layer control next to zoom
    L.control.layers(baseMaps, {}, {
      position: 'bottomleft'
    }).addTo(this.map);

    // Add user location marker with custom icon
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(this.map)
      .bindPopup('Your location');

    this.addCarMarkers();
    this.updateNearestCars(location);
  }

  private addCarMarkers() {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Create bounds to fit all markers
    const bounds = L.latLngBounds([]);

    // Custom car icon
    const carIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">🚘</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    this.cars.forEach(car => {
      const marker = L.marker([car.location.lat, car.location.lng], { icon: carIcon })
        .bindPopup(this.createPopupContent(car))
        .on('click', () => this.onMarkerClick(car))
        .addTo(this.map);

      this.markers.push(marker);
      bounds.extend([car.location.lat, car.location.lng]);
    });

    // Fit bounds if we have markers
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }

  private createPopupContent(car: Car): string {
    return `
      <div class="p-4 max-w-xs">
        <div class="flex items-center gap-4">
          <img src="${car.images[0]}" alt="${car.make} ${car.model}" 
               class="w-20 h-20 object-cover rounded-lg">
          <div>
            <h3 class="font-bold text-lg">${car.year} ${car.make} ${car.model}</h3>
            <p class="text-primary font-semibold">$${car.price}/day</p>
            <p class="text-sm text-gray-600">${car.location.address}</p>
          </div>
        </div>
      </div>
    `;
  }

  private updateNearestCars(location: { lat: number; lng: number }) {
    this.nearestCars = this.cars
      .map(car => ({
        car,
        distance: this.calculateDistance(
          location.lat,
          location.lng,
          car.location.lat,
          car.location.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(item => item.car);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  toggleNearestCars() {
    this.showNearestCars = !this.showNearestCars;
  }

  onMarkerClick(car: Car) {
    this.selectedCar = car;
    this.showNearestCars = true;
  }
}