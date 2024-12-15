import { Injectable } from '@angular/core';
import { Firestore, collection, setDoc, doc, query, collectionGroup, getDocs, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

export interface Transaction {
  transactionId?: string;
  carId: string;
  renterId: string; // User who makes the transaction
  ownerId: string; // User who leases the car
  totalAmount: number;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Add a new transaction using async/await
  async createTransaction(transaction: Transaction): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const transactionRef = collection(this.firestore, 'transactions');
    const newTransactionRef = doc(transactionRef);
    const newTransaction = {
      ...transaction,
      renterId: user.uid,
      transactionId: String(newTransactionRef.id), // Automatically generate a new document ID
    };

    try {
      await setDoc(newTransactionRef, newTransaction);
      console.log('Transaction successfully created:', newTransaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
  getAllTransactions(): Observable<Transaction[]> {
    const user = this.auth.currentUser;
    if (!user) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
    } else {
    console.log('Authenticated user:', user.uid);
    }

    const transactionsQuery = collectionGroup(this.firestore, 'transactions');

    return from(
      getDocs(transactionsQuery).then((snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
          transactionId: doc.id,
          ...doc.data(),
        } as Transaction));
        console.log('Fetched all transactions:', transactions);
        return transactions;
      })
    );
  }

  getUserTransactions(): Observable<Transaction[]> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
  
    // Query transactions where the user is either the renter or the owner
    const renterQuery = query(
      collectionGroup(this.firestore, 'transactions'),
      where('renterId', '==', user.uid)
    );
  
    const ownerQuery = query(
      collectionGroup(this.firestore, 'transactions'),
      where('ownerId', '==', user.uid)
    );
  
    return from(
      Promise.all([getDocs(renterQuery), getDocs(ownerQuery)]).then(([renterSnapshot, ownerSnapshot]) => {
        const renterTransactions = renterSnapshot.docs.map((doc) => ({
          transactionId: doc.id,
          ...doc.data(),
        } as Transaction));
  
        const ownerTransactions = ownerSnapshot.docs.map((doc) => ({
          transactionId: doc.id,
          ...doc.data(),
        } as Transaction));
  
        // Combine results and remove duplicates
        const allTransactions = [...renterTransactions, ...ownerTransactions];
        console.log('Fetched user transactions:', allTransactions);
        return allTransactions;
      })
    );
  }
  
}
