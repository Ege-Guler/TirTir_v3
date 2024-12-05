import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { CarService } from '../../../services/car.service';
import { ListingService } from '../../../services/listing.service';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import * as L from 'leaflet';

interface ListingForm {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'otomatik' | 'manuel';
  fuelType: 'dizel' | 'benzin' | 'elektrik' | 'hibrit';
  seats: number;

  category: 'Otomobil' | 'SUV' | 'Ticari';
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
  images: string[];


}

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('locationMap') mapElement!: ElementRef<HTMLDivElement>;

  currentStep = 1;
  totalSteps = 5;
  isDragging = false;
  isLoadingLocation = false;
  locationError = '';
  currentYear = new Date().getFullYear();
  maxYear = this.currentYear;

  form: ListingForm = {
    id: '',
    make: '',
    model: '',
    year: this.currentYear,
    price: 0,
    mileage: 0,
    transmission: 'otomatik',
    fuelType: 'dizel',
    category: 'Otomobil',
    seats: 2,
    features: [],
    images: [],
    location: {
      lat: 41.0082,
      lng: 28.9784,
      address: ''
    },
    owner: {
      uid: '',
      displayName: '',
      email: '',
      phone: ''
    }
  };

  availableFeatures: string[] = [];
  categories: string[] = [];
  transmissionTypes: string[] = [];
  fuelTypes: string[] = [];

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private darkLayer: L.TileLayer | null = null;
  private defaultLocation = { lat: 41.0082, lng: 28.9784 }; // Istanbul

  constructor(private authService: AuthService, private router: Router, private listingService: ListingService, private carService: CarService) {
    this.availableFeatures = this.carService.getFeatures();
    this.categories = this.carService.getCategories();
    this.transmissionTypes = this.carService.getTransmissionTypes();
    this.fuelTypes = this.carService.getFuelTypes();
  }

  ngOnInit() {
    // Initialize form with default values
  }

  ngAfterViewInit() {
    if (this.currentStep === 5) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.darkLayer = null;
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      if (this.currentStep === 5) {
        setTimeout(() => this.initMap(), 0);
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  toggleFeature(feature: string) {
    const index = this.form.features.indexOf(feature);
    if (index === -1) {
      this.form.features.push(feature);
    } else {
      this.form.features.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.form.images.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removePhoto(index: number) {
    this.form.images.splice(index, 1);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              this.form.images.push(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  async getCurrentLocation() {
    this.isLoadingLocation = true;
    this.locationError = '';

    try {
      const position = await this.getUserPosition();
      const { latitude: lat, longitude: lng } = position.coords;

      if (this.map && this.marker) {
        this.map.setView([lat, lng], 15);
        this.marker.setLatLng([lat, lng]);
        await this.updateLocation(lat, lng);
      }
    } catch (error) {
      this.locationError = 'Could not get your location. Please select manually on the map.';
      console.error('Geolocation error:', error);
    } finally {
      this.isLoadingLocation = false;
    }
  }

  private getUserPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  }

  private async updateLocation(lat: number, lng: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data && data.display_name) {
        this.form.location = {
          lat,
          lng,
          address: data.display_name // The full address returned by Nominatim
        };
      } else {
        this.form.location.address = ''; // Clear address if not found
        console.error('Address not found in response:', data);
      }
    } catch (error) {
      console.error('Nominatim API error:', error);
      this.locationError = 'Could not get address for selected location';
    }
  }
  

  private initMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
      this.darkLayer = null;
    }

    // Create dark layer
    this.darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Initialize map
    this.map = L.map('location-map', {
      center: [this.defaultLocation.lat, this.defaultLocation.lng],
      zoom: 13,
      zoomControl: false,
      layers: [this.darkLayer]
    });

    // Add zoom control to bottom left
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">📍</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // Add marker
    this.marker = L.marker([this.defaultLocation.lat, this.defaultLocation.lng], {
      icon: customIcon,
      draggable: true
    }).addTo(this.map);

    // Set up event listeners
    this.marker.on('dragend', async () => {
      if (this.marker) {
        const position = this.marker.getLatLng();
        await this.updateLocation(position.lat, position.lng);
      }
    });

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
        await this.updateLocation(e.latlng.lat, e.latlng.lng);
      }
    });

    // Force a resize to ensure proper rendering
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  async onSubmit() {
    try {
      const user: User | null = this.authService.getCurrentUser();
  
      if (!user) {
        throw new Error('User is not authenticated.');
      }
  
      // Add the owner details to the form
      this.form.owner = {
        uid: user.id,
        email: user.email,
        phone: user.phone,
        displayName: `${user.firstName} ${user.lastName}`,
      };
  
      // Save the listing
      await this.listingService.addListing(this.form);
  
      // Show success message
  
      // Delay redirection to allow user to see the message
      setTimeout(() => {
        this.router.navigate(['/listings']); // Replace '/listings' with your desired route
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save the listing. Please try again.');
    }
  }
  
}