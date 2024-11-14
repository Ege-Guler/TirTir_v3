import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'ns-app',
  template: `
    <GridLayout rows="auto, *">
      <GridLayout row="0" columns="*, auto" class="p-4 bg-primary">
        <Label col="0" text="CarShare" class="text-2xl font-bold text-white"></Label>
        <Label col="1" text="Menu" class="text-white" (tap)="onMenu()"></Label>
      </GridLayout>
      
      <page-router-outlet row="1"></page-router-outlet>
    </GridLayout>
  `
})
export class AppComponentMobile {
  constructor(private routerExtensions: RouterExtensions) {}

  onMenu() {
    // Menu functionality will be implemented later
  }
}