import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent {}