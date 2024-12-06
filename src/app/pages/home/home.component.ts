import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CarService, Car } from '../../services/car.service';
import { ListingService } from '../../services/listing.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, WeatherWidgetComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredCars: Car[] = [];
  isLoading = true;

  currentSlide = 0;

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.loadGlobalCars();

  }
  private loadGlobalCars() {
    this.listingService.getAllListings().subscribe(
      (cars) => {
        this.featuredCars = cars; // Assign the fetched cars
      },
      (error) => {
        console.error('Error fetching global listings:', error);
        this.featuredCars = []; // Fallback in case of error
      },
      () => {
        this.isLoading = false; // Stop loading indicator
      }
    );
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.featuredCars.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredCars.length - 1 
      : this.currentSlide - 1;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }
}