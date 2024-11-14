import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, Location } from '../../services/location.service';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements OnDestroy {
  @Input() placeholder = 'Search location';
  @Input() initialLocation?: Location;
  @Output() locationSelected = new EventEmitter<Location>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchQuery = '';
  locations: Location[] = [];
  isLoading = false;
  showResults = false;
  selectedLocation?: Location;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private locationService: LocationService) {
    // Initialize with initial location if provided
    if (this.initialLocation) {
      this.selectedLocation = this.initialLocation;
      this.searchQuery = this.initialLocation.name;
    }

    // Set up search subscription
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.isLoading = true;
        return this.locationService.searchLocations(query);
      })
    ).subscribe({
      next: (results) => {
        this.locations = results;
        this.isLoading = false;
        this.showResults = true;
      },
      error: () => {
        this.isLoading = false;
        this.showResults = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: string): void {
    this.selectedLocation = undefined;
    if (query.length >= 2) {
      this.searchSubject.next(query);
    } else {
      this.locations = [];
      this.showResults = false;
    }
  }

  onLocationClick(location: Location): void {
    this.searchQuery = location.name;
    this.showResults = false;
    this.selectedLocation = location;
    this.locationSelected.emit(location);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.locations = [];
    this.showResults = false;
    this.selectedLocation = undefined;
    this.locationSelected.emit(undefined);
    this.searchInput.nativeElement.focus();
  }

  onFocus(): void {
    if (!this.selectedLocation && this.searchQuery.length >= 2) {
      this.showResults = true;
    }
  }

  onBlur(): void {
    // Delay hiding results to allow click events to fire
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  getLocationIcon(type: Location['type']): string {
    switch (type) {
      case 'airport':
        return 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';
      case 'postcode':
        return 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z';
      case 'country':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
      default: // city
        return 'M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z';
    }
  }

  getLocationTypeLabel(type: Location['type']): string {
    switch (type) {
      case 'airport':
        return 'Airport';
      case 'postcode':
        return 'Postal Code';
      case 'country':
        return 'Country';
      default:
        return 'City';
    }
  }
}