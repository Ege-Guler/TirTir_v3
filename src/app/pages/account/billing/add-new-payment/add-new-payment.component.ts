import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button.component'; // Correct path for ButtonComponent

@Component({
  selector: 'app-add-new-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent], // Include ButtonComponent
  templateUrl: './add-new-payment.component.html',
  styleUrls: ['./add-new-payment.component.css'],
})
export class AddNewPaymentComponent {
  newPaymentMethod = {
    cardName: '',
    cardNumber: '',
    expiryDate: ''
  };

  constructor(private router: Router) {}

  addPaymentMethod() {
    console.log('New Payment Method:', this.newPaymentMethod);

    // Navigate back to the billing page
    this.router.navigate(['/account/billing']);
  }

  cancel() {
    console.log('Canceled');

    // Navigate back to the billing page
    this.router.navigate(['/account/billing']);
  }
}
