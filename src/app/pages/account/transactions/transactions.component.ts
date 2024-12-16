import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../services/booking.service';
import { Observable } from 'rxjs';
import { Transaction, TransactionService } from '../../../services/transaction.service';
import { CommentService } from '../../../services/comment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  commentBoxOpen: boolean[] = [];
  commentTexts: string[] = [];
  constructor(private transactionService: TransactionService, private commentService:CommentService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.transactionService.getUserTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        console.log('Transactions:', transactions);
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },
    });
  }

  toggleCommentBox(index: number) {
    this.commentBoxOpen[index] = !this.commentBoxOpen[index];
  }

  cancelComment(index: number) {
    this.commentTexts[index] = '';
    this.commentBoxOpen[index] = false;
  }

  submitComment(transactionName: string,ownerId:string, index: number, transactionId: string, carId: string) {
    const comment = this.commentTexts[index];
    this.commentService.addCommentToUser(transactionId, transactionName, ownerId, comment, carId);  
  }

}
