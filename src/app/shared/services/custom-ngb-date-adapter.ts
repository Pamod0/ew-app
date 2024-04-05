import { Injectable } from '@angular/core';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomNgbDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {        
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? this.padLeadingZeros(date.month,2) + this.DELIMITER + this.padLeadingZeros(date.day,2) + this.DELIMITER + this.padLeadingZeros(date.year,2)
      : null;
  }
}
