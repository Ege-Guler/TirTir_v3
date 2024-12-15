import { Pipe, PipeTransform } from '@angular/core';
import { toArray } from 'rxjs';

@Pipe({
  name: 'cc'
})
export class CCPipe implements PipeTransform {
  private dictionary: { [key: string]: string } = {
    visa: 'Visa',
    mastercard: 'MasterCard',
    troy: 'Troy',
  };

  transform(value: string): string {
    if (!value) return value;

    const words = value.split(' ');
    const translatedWords = words.map(word => this.dictionary[word.toLowerCase()] || word);
    return translatedWords.join(' ');
  }
}
