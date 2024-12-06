import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { BookingService } from '../../services/booking.service';
import { DateService } from '../../services/date.service';
import { PriceCalculatorService } from '../../services/price-calculator.service';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers: [BookingService, DateService, PriceCalculatorService]
})
export class BookComponent implements OnInit {
  car?: Car | null;
  startDate: string = '';
  endDate: string = '';
  totalDays: number = 0;
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private bookingService: BookingService,
    private dateService: DateService,
    private priceCalculator: PriceCalculatorService,
    private listingService: ListingService
  ) {}

  async ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {

        try{
            this.car = await this.listingService.getCarById(carId);

        }catch(e){
            console.error('Error fetching car:', e);
      };
    }
  }

  onDateChange() {
    if (this.startDate && this.endDate && this.car) {
      this.totalDays = this.dateService.calculateDays(this.startDate, this.endDate);
      this.totalPrice = this.priceCalculator.calculateTotalPrice(this.car.price, this.totalDays);
    }
  }

  onSubmit() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (this.car) {
      this.bookingService.createBooking({
        carId: this.car.id,
        car: this.car,
        startDate: this.startDate,
        endDate: this.endDate,
        totalPrice: this.totalPrice,
        status: 'active'
      }).subscribe(() => {
        this.router.navigate(['/account/booking']);
      });
    }
  }
}