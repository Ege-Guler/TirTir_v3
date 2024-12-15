import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../services/booking.service';
import { Observable } from 'rxjs';
import { Transaction, TransactionService } from '../../../services/transaction.service';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

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
}
