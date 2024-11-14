import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Location {
  id: string;
  name: string;
  type: 'city' | 'airport' | 'postcode' | 'country';
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  countryCode: string;
  placeId?: string;
  formattedAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly API_KEY = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
  private readonly GEOCODING_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour
  private cache: Map<string, { data: Location[], timestamp: number }> = new Map();

  searchLocations(query: string): Observable<Location[]> {
    if (!query.trim()) {
      return of([]);
    }

    // Check cache first
    const cached = this.cache.get(query);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of(cached.data);
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `${this.GEOCODING_API}/${encodedQuery}.json?access_token=${this.API_KEY}&types=place,postcode,country,airport&language=en&limit=10`;

    return from(
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Location search failed');
          }
          return response.json();
        })
    ).pipe(
      map(response => {
        const locations = this.transformResults(response.features);
        // Update cache
        this.cache.set(query, { data: locations, timestamp: Date.now() });
        return locations;
      }),
      catchError(error => {
        console.error('Location search error:', error);
        return of([]);
      })
    );
  }

  private transformResults(features: any[]): Location[] {
    if (!features) return [];
    
    return features.map(feature => ({
      id: feature.id,
      name: feature.text,
      type: this.getLocationType(feature.place_type[0]),
      coordinates: {
        lat: feature.center[1],
        lng: feature.center[0]
      },
      country: feature.context?.find((ctx: any) => ctx.id.startsWith('country'))?.text || '',
      countryCode: feature.context?.find((ctx: any) => ctx.id.startsWith('country'))?.short_code?.toUpperCase() || '',
      placeId: feature.id,
      formattedAddress: feature.place_name
    }));
  }

  private getLocationType(type: string): Location['type'] {
    switch (type) {
      case 'place':
        return 'city';
      case 'postcode':
        return 'postcode';
      case 'country':
        return 'country';
      case 'airport':
        return 'airport';
      default:
        return 'city';
    }
  }

  getLocationDetails(placeId: string): Observable<Location | null> {
    const url = `${this.GEOCODING_API}/${placeId}.json?access_token=${this.API_KEY}`;
    
    return from(
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Location details fetch failed');
          }
          return response.json();
        })
    ).pipe(
      map(response => {
        if (response.features?.length > 0) {
          return this.transformResults([response.features[0]])[0];
        }
        return null;
      }),
      catchError(error => {
        console.error('Location details error:', error);
        return of(null);
      })
    );
  }
}