import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'listAsString',
})
export class ListAsStringPipe implements PipeTransform {
  transform(value: number, listType: any): any {
    if (value != null || value != undefined) {      
        return _.find(listType, {
          value: value,
        }).label;    
    } else {
      return '';
    }
  }
}
