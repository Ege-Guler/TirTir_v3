import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button.component';
import { PaymentMethod } from '../billing.component';
import { AuthService, User } from '../../../../services/auth.service';
import { BillingService } from '../../../../services/billing.service';

@Component({
  selector: 'app-add-new-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './add-new-payment.component.html',
  styleUrls: ['./add-new-payment.component.css'],
})
export class AddNewPaymentComponent {
  billingMethod: PaymentMethod;

  months: { value: string; label: string }[] = [];
  years: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private billingService: BillingService
  ) {
    this.billingMethod = {
      id: '',
      type: 'visa',
      cardHolderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      isDefault: false,
    };

    this.generateMonths();
    this.generateYears();
  }

  generateMonths() {
    this.months = Array.from({ length: 12 }, (_, i) => {
      const value = (i + 1).toString().padStart(2, '0');
      const label = new Date(0, i).toLocaleString('tr-Tr', { month: 'long' });
      return { value, label };
    });
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 15; i++) {
      this.years.push((currentYear + i).toString());
    }
  }

  async onSubmit() {
    try {
      const user: User | null = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Add payment method via the billing service
      await this.billingService.addBillingMethod(this.billingMethod);

      // Navigate to billing page after a short delay
      setTimeout(() => {
        this.router.navigate(['/account/billing']);
      }, 500);
    } catch (error) {
      console.error('Failed to add billing method:', error);
    }
  }

  cancel() {
    console.log('Canceled');
    this.router.navigate(['/account/billing']);
  }
}
