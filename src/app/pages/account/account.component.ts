import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { Observable, from, throwError, of, switchMap, map, catchError } from 'rxjs';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  currentUser$: Observable<User | null>;
  lastLogin!: string | null;
  selectedFile: File | null = null;
  imageResult: string = '';
  downloadUrl: string = '';
  uploadSuccess = false;
  uploadError = false;
  processing = false;

  private readonly FIREBASE_FUNCTION_URL = 
  'https://us-central1-tirtir-61.cloudfunctions.net/processImage';

  constructor(private authService: AuthService, private imageUploadService: ImageUploadService) { 
    this.currentUser$ = this.authService.currentUser$;
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.lastLogin = user.lastLogin[1].toLocaleString('tr-TR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }
    });
  }
  async onFileSelected(event: Event): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      this.uploadError = true;
      this.processing = true;
      setTimeout(() => (this.uploadError = false), 3000);
      return;
    }
  
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      try {
        // Upload the image and get the image URL
        const imageUrl = await this.imageUploadService.uploadUserImage(user.id, file);
        console.log('Image uploaded successfully:', imageUrl);
  
        this.uploadSuccess = true; 
        this.downloadUrl = imageUrl; // Store the URL if needed for later use
        setTimeout(() => (this.uploadSuccess = false), 3000); 
      } catch (error) {
        console.error('Upload failed:', error);
        this.uploadError = true; 
        setTimeout(() => (this.uploadError = false), 3000);
      }
    }
  }
  




  processImage(): Observable<string> {
    console.log('Processing image...');
    console.log('Image URL:', this.downloadUrl);
    if (!this.downloadUrl) {
      console.error('Error: Image URL is required.');
      return throwError(() => new Error('Image URL is required.'));
    }
  
    return from(
      fetch(this.FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: this.downloadUrl }),
      })
    ).pipe(
      switchMap(async (response) => {
        console.log('HTTP Response:', response);
        if (!response.ok) {
          const errorBody = await response.text(); // Extract error details if any
          console.error('Error Response Body:', errorBody);
          return throwError(() => new Error('Error processing image.'));
        }
        return response.json();
      }),
      map((data: { success?: boolean; text: string }) => {
        console.log('Response Data:', data);
        if (data?.text) {
          console.log('Extracted Text:', data.text);
          return data.text;
        } else {
          throw new Error('Text extraction failed.');
        }
      }),
      catchError((error) => {
        console.error('Error processing image:', error.message || error);
        return throwError(() => new Error('Error processing image. Please try again.'));
      })
    );
  }
  

    

}