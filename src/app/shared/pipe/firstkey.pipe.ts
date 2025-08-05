import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstkey'
})
export class FirstkeyPipe implements PipeTransform {

  transform(value: any): string | null {
    if (value && typeof value === 'object' && !Array.isArray(value)){
    const key = Object.keys(value);
    if(key && key.length > 0){
      return key[0];
      }
    }
    return null;
  }

}
