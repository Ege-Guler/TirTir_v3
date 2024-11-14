import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() full = false;

  get buttonClasses(): string {
    return [
      'btn',
      `btn-${this.variant}`,
      this.size === 'sm' ? 'text-sm px-3 py-1.5' :
      this.size === 'lg' ? 'text-lg px-8 py-4' :
      'text-base px-6 py-3',
      this.full ? 'w-full' : ''
    ].filter(Boolean).join(' ');
  }
}