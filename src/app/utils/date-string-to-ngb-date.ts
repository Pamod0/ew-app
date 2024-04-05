import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class DateStringToNgbDate {
  static transform(dateString: string): any {
    let momentDate = moment(dateString, 'MM/DD/YYYY');
    let value = new NgbDate(
      momentDate.year(),
      momentDate.month(),
      momentDate.day()
    );

    // return value;
    var todayDate = new Date();
    return {
      year: todayDate.getFullYear(),
      month: todayDate.getMonth() + 1,
      day: todayDate.getDate()
    }

  }
}
