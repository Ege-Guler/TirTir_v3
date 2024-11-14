import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { Location } from '../../services/location.service';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LocationSearchComponent],
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.css']
})
export class SearchFiltersComponent implements OnInit {
  @Input() maxPrice: number = 200;
  @Input() selectedMake: string = '';
  @Input() makes: string[] = [];
  @Output() filtersChange = new EventEmitter<{
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
  }>();

  isExpanded = true;
  isDesktop = window.innerWidth >= 1024;
  selectedLocation?: Location;
  minPrice = 0;
  yearRange: number[] = [];
  minYear = 2015;
  maxYear = new Date().getFullYear();
  maxMileage = 100000;
  selectedCategory = '';
  selectedTransmission = '';
  selectedFuelType = '';
  selectedFeatures: string[] = [];

  categories: string[] = [];
  transmissionTypes: string[] = [];
  fuelTypes: string[] = [];
  features: string[] = [];

  constructor(private carService: CarService) {
    window.addEventListener('resize', this.checkDesktop.bind(this));
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.yearRange = Array.from(
      { length: currentYear - 2010 + 1 }, 
      (_, i) => currentYear - i
    );

    this.categories = this.carService.getCategories();
    this.transmissionTypes = this.carService.getTransmissionTypes();
    this.fuelTypes = this.carService.getFuelTypes();
    this.features = this.carService.getFeatures();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkDesktop.bind(this));
  }

  private checkDesktop() {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) {
      this.isExpanded = true;
    }
  }

  toggleFilters() {
    this.isExpanded = !this.isExpanded;
  }

  onLocationSelected(location: Location) {
    this.selectedLocation = location;
    this.onFilterChange();
  }

  toggleFeature(feature: string) {
    const index = this.selectedFeatures.indexOf(feature);
    if (index === -1) {
      this.selectedFeatures.push(feature);
    } else {
      this.selectedFeatures.splice(index, 1);
    }
    this.onFilterChange();
  }

  onFilterChange() {
    this.filtersChange.emit({
      maxPrice: this.maxPrice,
      selectedMake: this.selectedMake,
      location: this.selectedLocation,
      minYear: this.minYear,
      maxYear: this.maxYear,
      maxMileage: this.maxMileage,
      selectedCategory: this.selectedCategory,
      selectedTransmission: this.selectedTransmission,
      selectedFuelType: this.selectedFuelType,
      selectedFeatures: this.selectedFeatures
    });
  }

  clearFilters() {
    this.maxPrice = 200;
    this.selectedMake = '';
    this.selectedLocation = undefined;
    this.minYear = 2015;
    this.maxYear = new Date().getFullYear();
    this.maxMileage = 100000;
    this.selectedCategory = '';
    this.selectedTransmission = '';
    this.selectedFuelType = '';
    this.selectedFeatures = [];
    this.onFilterChange();
  }
}