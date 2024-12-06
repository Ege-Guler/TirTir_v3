import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where,doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Car } from './car.service'; // Import the Car interface from CarService
import { Observable, from } from 'rxjs';

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
    listing.id = String(newListingRef.id);
    // Add the listing to Firestore
    await setDoc(newListingRef, listing);
  }

  // Retrieve all listings for the currently authenticated user
  getListings(): Observable<Car[]> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userListingRef = collection(this.firestore, `users/${user.uid}/listings`);
    const listingsQuery = query(userListingRef);

    // Fetch and map Firestore documents to Car objects
    return from(
      getDocs(listingsQuery).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Car))
      )
    );
  }

  async removeListing(listingId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const listingDocRef = doc(this.firestore, `users/${user.uid}/listings/${listingId}`);
    await deleteDoc(listingDocRef);
  }
}
