import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit, OnDestroy {
  weather?: WeatherData;
  error?: string;
  isLoading = true;
  private weatherSubscription?: Subscription;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadWeather();
  }

  ngOnDestroy() {
    if (this.weatherSubscription) {
      this.weatherSubscription.unsubscribe();
    }
  }

  retryWeather() {
    this.error = undefined;
    this.weather = undefined;
    this.isLoading = true;
    this.loadWeather();
  }

  private loadWeather() {
    this.weatherSubscription = this.weatherService.getWeather().subscribe({
      next: (weather) => {
        this.weather = weather;
        this.error = undefined;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Unable to fetch weather data';
        this.weather = undefined;
        this.isLoading = false;
      }
    });
  }
}