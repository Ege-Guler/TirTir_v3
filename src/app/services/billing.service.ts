import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, query, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { PaymentMethod } from '../pages/account/billing/billing.component';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class BillingService {
  constructor(private firestore: Firestore, private auth:Auth, private router: Router) {}

  getUserMethods(): Observable<PaymentMethod[]> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const billingRef = collection(this.firestore, `users/${user.uid}/billing`);
    const billingQuery = query(billingRef);

    return from( 
      getDocs(billingRef).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }) as PaymentMethod)
      )
    )
  }

  async addBillingMethod(billingMethod: PaymentMethod): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const billingRef = collection(this.firestore, `users/${user.uid}/billing`);
    const newBillingDoc = doc(billingRef);
    billingMethod.id = newBillingDoc.id;

    await setDoc(newBillingDoc, billingMethod);
  }

  async removeBillingMethod(methodId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const billingDocRef = doc(this.firestore, `users/${user.uid}/billing/${methodId}`);
    await deleteDoc(billingDocRef);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/account/billing']);
    });
  }

  async setDefaultBillingMethod(userId: string, methodId: string): Promise<void> {
    const billingRef = collection(this.firestore, `users/${userId}/billing`);
    const snapshot = await getDocs(billingRef);

    const batch = (await import('firebase/firestore')).writeBatch(this.firestore);
    snapshot.docs.forEach((doc) => {
      const isDefault = doc.id === methodId;
      batch.update(doc.ref, { isDefault });
    });
    await batch.commit();
  }
}
