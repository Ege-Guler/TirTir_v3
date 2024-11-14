import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/24',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'paypal',
      isDefault: false
    }
  ];

  removePaymentMethod(id: string) {
    this.paymentMethods = this.paymentMethods.filter(pm => pm.id !== id);
  }

  setDefaultPaymentMethod(id: string) {
    this.paymentMethods = this.paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    }));
  }
}