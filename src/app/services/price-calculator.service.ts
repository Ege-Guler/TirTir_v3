import { Injectable } from '@angular/core';

@Injectable()
export class PriceCalculatorService {
  calculateTotalPrice(dailyRate: number, days: number): number {
    return dailyRate * days;
  }
}