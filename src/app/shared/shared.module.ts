import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './pipes/translate.pipe';
import { CCPipe } from './pipes/card.pipe';

@NgModule({
  declarations: [TranslatePipe, CCPipe],
  imports: [CommonModule],
  exports: [TranslatePipe, CCPipe],
})
export class SharedModule {}
