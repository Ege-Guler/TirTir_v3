import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TırTır';
  showWelcome = true;

  ngOnInit() {
    // Hide welcome screen after animation
    setTimeout(() => {
      this.showWelcome = false;
    }, 3000); // 3 seconds total (matches CSS animation duration)
  }
}