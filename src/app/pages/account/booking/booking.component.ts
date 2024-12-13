import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../../services/booking.service';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { SharedModule } from '../../../shared/shared.module';
type TabType = 'all' | 'active' | 'upcoming' | 'completed';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, BookingCardComponent, SharedModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookings: Booking[] = [];
  activeTab: TabType = 'all';
  tabs: TabType[] = ['all', 'active', 'upcoming', 'completed'];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  setActiveTab(tab: TabType) {
    this.activeTab = tab;
  }

  get filteredBookings(): Booking[] {
    if (this.activeTab === 'all') {
      return this.bookings;
    }
    return this.bookings.filter(booking => booking.status === this.activeTab);
  }
}