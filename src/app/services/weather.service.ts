import { Injectable } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap, timeout } from 'rxjs/operators';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  location: string;
}

interface WeatherResponse {
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = '89ac05589e51d95beb1532dbb808c03e';
  private readonly FALLBACK_LOCATION = {
    coords: {
      latitude: 41.0082,
      longitude: 28.9784
    }
  };

  getWeather(): Observable<WeatherData> {
    return from(this.getCurrentPosition()).pipe(
      timeout(5000),
      catchError(() => of(this.FALLBACK_LOCATION)),
      switchMap(position => {
        const { latitude, longitude } = position.coords;
        return from(
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`,
            { 
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          ).then(response => {
            if (!response.ok) {
              throw new Error('Weather API error');
            }
            return response.json();
          })
        ).pipe(
          catchError(error => {
            console.error('Weather API error:', error);
            return throwError(() => new Error('Unable to fetch weather data'));
          })
        );
      }),
      map((data: WeatherResponse) => ({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        location: data.name
      })),
      catchError(error => {
        console.error('Weather error:', error);
        return throwError(() => 
          error.message === 'User denied Geolocation' 
            ? new Error('Please enable location services to see local weather')
            : new Error('Unable to fetch weather data')
        );
      })
    );
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          reject(new Error(
            error.code === error.PERMISSION_DENIED 
              ? 'User denied Geolocation'
              : 'Unable to get location'
          ));
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }
}