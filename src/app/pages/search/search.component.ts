import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Car } from '../../services/car.service';
import { CarCardComponent } from '../../components/car-card/car-card.component';
import { MapViewComponent } from '../../components/map-view/map-view.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { LocationSearchComponent } from '../../components/location-search/location-search.component';
import { Location } from '../../services/location.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CarCardComponent, 
    MapViewComponent, 
    SearchFiltersComponent,
    ButtonComponent,
    LocationSearchComponent
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  cars: Car[] = [];
  viewMode: 'grid' | 'map' = 'map';
  isFiltersOpen = false;
  maxPrice = 200;
  selectedMake = '';
  selectedLocation?: Location;
  makes: string[] = [];
  minYear = 2015;
  maxYear = new Date().getFullYear();
  maxMileage = 100000;
  selectedCategory = '';
  selectedTransmission = '';
  selectedFuelType = '';
  selectedFeatures: string[] = [];
  tempFilters: any = {};

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getCars().subscribe(cars => {
      this.cars = cars;
      this.makes = [...new Set(cars.map(car => car.make))].sort();
    });
    this.initTempFilters();
  }

  
  private initTempFilters() {
    this.tempFilters = {
      maxPrice: this.maxPrice,
      selectedMake: this.selectedMake,
      location: this.selectedLocation,
      minYear: this.minYear,
      maxYear: this.maxYear,
      maxMileage: this.maxMileage,
      selectedCategory: this.selectedCategory,
      selectedTransmission: this.selectedTransmission,
      selectedFuelType: this.selectedFuelType,
      selectedFeatures: [...this.selectedFeatures]
    };
  }

  onLocationSelected(location: Location) {
    this.selectedLocation = location;
    this.tempFilters.location = location;
    this.onFiltersChange(this.tempFilters);
  }

  toggleFilters() {
    if (!this.isFiltersOpen) {
      this.initTempFilters();
    }
    this.isFiltersOpen = !this.isFiltersOpen;
    document.body.style.overflow = this.isFiltersOpen ? 'hidden' : '';
  }

  applyFilters() {
    this.maxPrice = this.tempFilters.maxPrice;
    this.selectedMake = this.tempFilters.selectedMake;
    this.selectedLocation = this.tempFilters.location;
    this.minYear = this.tempFilters.minYear;
    this.maxYear = this.tempFilters.maxYear;
    this.maxMileage = this.tempFilters.maxMileage;
    this.selectedCategory = this.tempFilters.selectedCategory;
    this.selectedTransmission = this.tempFilters.selectedTransmission;
    this.selectedFuelType = this.tempFilters.selectedFuelType;
    this.selectedFeatures = [...this.tempFilters.selectedFeatures];
    this.isFiltersOpen = false;
    document.body.style.overflow = '';
  }

  clearAllFilters() {
    this.tempFilters = {
      maxPrice: 200,
      selectedMake: '',
      location: undefined,
      minYear: 2015,
      maxYear: new Date().getFullYear(),
      maxMileage: 100000,
      selectedCategory: '',
      selectedTransmission: '',
      selectedFuelType: '',
      selectedFeatures: []
    };
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedMake) count++;
    if (this.maxPrice !== 200) count++;
    if (this.selectedLocation) count++;
    if (this.minYear !== 2015) count++;
    if (this.maxYear !== new Date().getFullYear()) count++;
    if (this.maxMileage !== 100000) count++;
    if (this.selectedCategory) count++;
    if (this.selectedTransmission) count++;
    if (this.selectedFuelType) count++;
    count += this.selectedFeatures.length;
    return count;
  }

  onFiltersChange(filters: {
    maxPrice: number;
    selectedMake: string;
    location?: Location;
    minYear: number;
    maxYear: number;
    maxMileage: number;
    selectedCategory?: string;
    selectedTransmission?: string;
    selectedFuelType?: string;
    selectedFeatures: string[];
  }) {
    this.tempFilters = { ...filters };
  }

  get filteredCars(): Car[] {
    return this.cars.filter(car => {
      const matchesPrice = car.price <= this.maxPrice;
      const matchesMake = !this.selectedMake || car.make === this.selectedMake;
      const matchesYear = car.year >= this.minYear && car.year <= this.maxYear;
      const matchesMileage = car.mileage <= this.maxMileage;
      const matchesCategory = !this.selectedCategory || car.category === this.selectedCategory;
      const matchesTransmission = !this.selectedTransmission || car.transmission === this.selectedTransmission;
      const matchesFuelType = !this.selectedFuelType || car.fuelType === this.selectedFuelType;
      const matchesFeatures = this.selectedFeatures.length === 0 || 
        this.selectedFeatures.every(feature => car.features.includes(feature));
      
      let matchesLocation = true;
      if (this.selectedLocation) {
        const distance = this.calculateDistance(
          car.location.lat,
          car.location.lng,
          this.selectedLocation.coordinates.lat,
          this.selectedLocation.coordinates.lng
        );
        matchesLocation = distance <= 50; // Within 50km radius
      }
      
      return matchesPrice && matchesMake && matchesYear && matchesMileage && 
             matchesLocation && matchesCategory && matchesTransmission && 
             matchesFuelType && matchesFeatures;
    });
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
}