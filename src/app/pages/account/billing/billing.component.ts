import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { Router } from '@angular/router';
import { BillingService } from '../../../services/billing.service';
import { AuthService } from '../../../services/auth.service';
import { SharedModule } from '../../../shared/shared.module';


export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'troy';
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SharedModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  paymentMethods: PaymentMethod[] = [] ;

  constructor(private router: Router, private billingService: BillingService, private authService:AuthService) {
    this.billingService.getUserMethods().subscribe((methods) => {
      this.paymentMethods = methods;
    });
  }


  navigateToAddNew() {
    this.router.navigate(['/account/billing/add-new']);
  }

  async setDefaultPaymentMethod(methodId: string) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    await this.billingService.setDefaultBillingMethod(user.id, methodId);

  }

  async removePaymentMethod(methodId: string) {
    console.log('Removing payment method:', methodId);
    await this.billingService.removeBillingMethod(methodId);
  }
}