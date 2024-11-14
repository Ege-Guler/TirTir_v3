import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: string;
  date: string;
  type: 'rental' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  description: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactions: Transaction[] = [
    {
      id: 'TR001',
      date: '2024-01-15',
      type: 'rental',
      amount: 150,
      status: 'completed',
      description: 'Truck rental - BMW 320i'
    },
    {
      id: 'TR002',
      date: '2024-01-10',
      type: 'payout',
      amount: 285,
      status: 'completed',
      description: 'Host payout'
    },
    {
      id: 'TR003',
      date: '2024-01-05',
      type: 'rental',
      amount: 95,
      status: 'cancelled',
      description: 'Truck rental - Mercedes C200'
    }
  ];
}