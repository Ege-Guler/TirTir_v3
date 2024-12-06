import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../services/listing.service';
import { Car } from '../../services/car.service';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { RouterModule } from '@angular/router';
import { CarCardComponent } from '../../components/car-card/car-card.component';


@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule, CarCardComponent],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  cars: Car[] = [];
  isLoading = true;

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.loadUserCars();
  }

  loadUserCars() {
    this.listingService.getListings().subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        console.error('Error fetching user listings:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onDeleteListing(listingId: string) {
    
      this.listingService.removeListing(listingId)
        .then(() => {
          // Update the UI to remove the deleted listing
          this.cars = this.cars.filter((car) => car.id !== listingId);
          alert('Listing successfully deleted!');
        })
        .catch((error) => {
          console.error('Error deleting listing:', error);
          alert('Failed to delete the listing. Please try again.');
        });
    
  }
  
}
