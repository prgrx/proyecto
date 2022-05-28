import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceLineBreaks'
})

export class ReplaceLineBreaksPipe implements PipeTransform {

  constructor() { }

  transform(text: any): string {
    return text.replaceAll('\\n', ' ');
  }

}