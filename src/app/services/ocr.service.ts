import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  private readonly apiUrl = 'https://us-central1-tirtir-61.cloudfunctions.net/processImage';

  constructor(private http: HttpClient) {}

  processImage(imageUrl: string): Observable<{ extractedText: string }> {
    return this.http.post<{ extractedText: string }>(this.apiUrl, { imageUrl });
  }
}
