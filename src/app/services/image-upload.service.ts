import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private storage: Storage) {}

  async uploadUserImage(userId: string, file: File): Promise<string> {
    try {
      const filePath = `users/${userId}/drivers-license-${Date.now()}`;
      const fileRef = ref(this.storage, filePath);

      // Upload the file to Firebase Storage
      await uploadBytes(fileRef, file);

      // Get and return the file's download URL
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
  }
}
