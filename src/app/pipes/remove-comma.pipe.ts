import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeComma'
})
export class RemoveCommaPipe implements PipeTransform {
  transform(value: string): string {
    if (value !== undefined && value !== null) {
      return value.replace(/,/g, "");
    } else {
      return "";
    }
  }

}


// We need to pass digit information parameter in following format “X.X-X”
// {minimumIntegerDigits}.{minimumFractionDigits}-{maximumFractionDigits}
// {{decimal_value | number:'1.2-2' | removeComma}}
//55234.34