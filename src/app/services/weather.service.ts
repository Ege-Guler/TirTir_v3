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
  providedIn: 'root',
})
export class WeatherService {
  private readonly FALLBACK_LOCATION = {
    coords: {
      latitude: 41.045824, // Istanbul's latitude
      longitude: 29.020456, // Istanbul's longitude
    },
  };

  private readonly FIREBASE_FUNCTION_URL =
    'https://us-central1-tirtir-61.cloudfunctions.net/getWeather'; // Replace <region> and <project-id> with your Firebase function's URL

  constructor() {}

  getWeather(): Observable<WeatherData> {
    return from(this.getCurrentPosition()).pipe(
      timeout(5000),
      catchError(() => of(this.FALLBACK_LOCATION)), // Use fallback location on error
      switchMap((position) => {
        const { latitude, longitude } = position.coords;
        return from(this.fetchWeatherData(latitude, longitude)).pipe(
          catchError((error) => {
            console.error('Weather API error:', error);
            return throwError(() => new Error('Unable to fetch weather data'));
          })
        );
      }),
      map((data: WeatherResponse) => ({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        location: data.name,
      })),
      catchError((error) => {
        console.error('Weather error:', error);
        return throwError(() =>
          error.message === 'User denied Geolocation'
            ? new Error('Please enable location services to see local weather')
            : new Error('Unable to fetch weather data')
        );
      })
    );
  }

  private fetchWeatherData(latitude: number, longitude: number): Promise<WeatherResponse> {
    // Call the Firebase Cloud Function instead of the OpenWeatherMap API directly
    const url = `${this.FIREBASE_FUNCTION_URL}?lat=${latitude}&lon=${longitude}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Weather API error');
      }
      return response.json();
    });
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
          const errorMessage =
            error.code === error.PERMISSION_DENIED
              ? 'User denied Geolocation'
              : 'Unable to get location';
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }
}
