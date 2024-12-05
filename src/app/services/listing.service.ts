import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Car } from './car.service'; // Import the Car interface from CarService

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Add a new listing to Firestore under the authenticated user
  async addListing(listing: Car): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userListingRef = collection(this.firestore, `users/${user.uid}/listings`);
    const newListingRef = doc(userListingRef); // Automatically generate a new document ID

    // Add the listing to Firestore
    await setDoc(newListingRef, listing);
  }
}
