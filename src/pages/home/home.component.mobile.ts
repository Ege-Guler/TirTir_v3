import { Component } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'ns-home',
  template: `
    <ScrollView>
      <StackLayout class="p-4">
        <StackLayout class="text-center p-8 bg-primary">
          <Label text="Rent the Perfect Car" class="text-3xl font-bold text-white"></Label>
          <Label text="Find your dream car for your next adventure" class="text-white mt-2"></Label>
          <Button text="Start Searching" class="btn mt-4" (tap)="onSearch()"></Button>
        </StackLayout>

        <Label text="How It Works" class="text-2xl font-bold text-center mt-8"></Label>
        
        <GridLayout rows="auto, auto, auto" class="mt-4">
          <StackLayout row="0" class="text-center p-4">
            <Label text="Find the Perfect Car" class="font-bold"></Label>
            <Label text="Browse our selection of cars and find the one that fits your needs" textWrap="true"></Label>
          </StackLayout>

          <StackLayout row="1" class="text-center p-4">
            <Label text="Book Your Trip" class="font-bold"></Label>
            <Label text="Choose your dates and book instantly" textWrap="true"></Label>
          </StackLayout>

          <StackLayout row="2" class="text-center p-4">
            <Label text="Hit the Road" class="font-bold"></Label>
            <Label text="Pick up your car and start your adventure" textWrap="true"></Label>
          </StackLayout>
        </GridLayout>
      </StackLayout>
    </ScrollView>
  `
})
export class HomeComponentMobile {
  constructor(private routerExtensions: RouterExtensions) {}

  onSearch() {
    this.routerExtensions.navigate(['/search']);
  }
}