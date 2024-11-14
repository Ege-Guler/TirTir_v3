import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, WeatherWidgetComponent, ButtonComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  featuredCars: Car[] = [];
  currentSlide = 0;

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getCars().subscribe(cars => {
      this.featuredCars = cars;
    });
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