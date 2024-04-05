import { Injectable } from '@angular/core';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class CustomNgbDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {        
        month : parseInt(date[0], 10),
        day : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  format(date: NgbDateStruct | null): string {
    return date ? this.padLeadingZeros(date.month,2) + this.DELIMITER + this.padLeadingZeros(date.day,2) + this.DELIMITER 
    + this.padLeadingZeros(date.year,4) : '';
  }
}