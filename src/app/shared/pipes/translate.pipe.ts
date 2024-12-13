import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  private dictionary: { [key: string]: string } = {
    all: 'tümü',
    active: 'aktif',
    upcoming: 'gelecek',
    completed: 'tamamlanmış',
  };

  transform(value: string): string {
    if (!value) return value;

    const words = value.split(' ');
    const translatedWords = words.map(word => this.dictionary[word.toLowerCase()] || word);
    return translatedWords.join(' ');
  }
}
