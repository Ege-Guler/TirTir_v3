import { Component, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { AuthService } from '../../services/auth.service';
import { Car } from '../../services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  hasListing = false;
  listing: Car | null = null;

  constructor(
    private listingService: ListingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Fetch existing listing
    this.listingService.getListing(user.uid).subscribe({
      next: (listing) => {
        if (listing) {
          this.listing = listing;
          this.hasListing = true;
        } else {
          this.hasListing = false;
        }
      },
      error: (err) => {
        console.error('Error fetching listing:', err);
        this.hasListing = false;
      }
    });
  }

  startListing() {
    this.router.navigate(['/create-listing']);
  }

  updateListing() {
    if (this.listing) {
      this.listingService.updateListing(this.listing).then(() => {
        alert('Listing updated successfully!');
      }).catch((err) => {
        console.error('Error updating listing:', err);
        alert('Failed to update listing. Please try again.');
      });
    }
  }
}
