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
      setTimeout(() => (this.uploadError = false), 3000);
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      try {
        await this.imageUploadService.uploadUserImage(user.id, file);
        this.uploadSuccess = true; 
        setTimeout(() => (this.uploadSuccess = false), 3000); 
      } catch (error) {
        console.error('Upload failed:', error);
        this.uploadError = true; 
        setTimeout(() => (this.uploadError = false), 3000);
      }
    }
  }




processImage(): Observable<string> {
  if (!this.downloadUrl) {
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
    switchMap((response) => {
      if (!response.ok) {
        return throwError(() => new Error('Error processing image.'));
      }
      return from(response.json());
    }),
    map((data: { success: boolean; extractedText: string }) => {
      if (data.success) {
        return data.extractedText;
      } else {
        throw new Error('Text extraction failed.');
      }
    }),
    catchError((error) => {
      console.error('Error processing image:', error);
      return throwError(() => new Error('Error processing image. Please try again.'));
    })
  );
}

    

}