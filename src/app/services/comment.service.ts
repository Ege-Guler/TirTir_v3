import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';


export interface Comment {
    commentId?: string;
    commentMaker: string;  
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
        transactionId: transactionId,
        transactionName: transactionName,
        forWhom: ownerId,
        text: commentText,
        carId: cardId,
        createdAt: serverTimestamp(),
    };
    
    return from(setDoc(newCommentRef, commentData));
  }
}
