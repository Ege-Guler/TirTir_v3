import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, serverTimestamp, collectionGroup, getDocs } from '@angular/fire/firestore';
import { from, Observable, catchError, of } from 'rxjs';
import { Auth } from '@angular/fire/auth';


export interface Comment {
    commentId?: string;
    commentMaker: string;
    commentMakerName: string;  
    transactionId: string;
    transactionName: string;
    forWhom: string;
    text: string;
    carId: string;
    createdAt?: any;
}
  

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  constructor(private firestore: Firestore, private auth:Auth) {}


  addCommentToUser(transactionId :string, transactionName:string, ownerId: string, commentText: string, cardId: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const commentsCollectionRef = collection(this.firestore, `users/${ownerId}/comments`);
    
    const newCommentRef = doc(commentsCollectionRef);
    
    const commentData: Comment = {
        commentId: String(newCommentRef.id),
        commentMaker: user.uid,
        commentMakerName: transactionName + ' ' + user.email,
        transactionId: transactionId,
        transactionName: transactionName,
        forWhom: ownerId,
        text: commentText,
        carId: cardId,
        createdAt: serverTimestamp(),
    };
    
    return from(setDoc(newCommentRef, commentData));
  }

  getAllCommentsForUser(userId: string): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, `users/${userId}/comments`);
  
    return from(
      getDocs(commentsCollection).then((snapshot) => {
        console.log('Fetched snapshot: for ', userId, snapshot); // Debugging snapshot
        return snapshot.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        } as Comment));
      })
    ).pipe(
      catchError((error) => {
        console.error('Error fetching comments:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
  

}
