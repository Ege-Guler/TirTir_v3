import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button.component';
import { Booking } from '../../../../services/booking.service';
import { SharedModule } from '../../../../shared/shared.module';
@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, SharedModule], // Add TranslatePipe to imports
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css'],
})
export class BookingCardComponent {
  @Input() booking!: Booking;
}
