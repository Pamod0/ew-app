import * as moment from 'moment';


export class DateToAgeString {

  static transform(dateString: any): any {

    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let yearNow = now.getFullYear();
    let monthNow = now.getMonth();
    let dateNow = now.getDate();

    // let dob = new Date(dateString);
    var dateMomentObject = moment(dateString, "MM/DD/YYYY"); // 1st argument - string, 2nd argument - format
    var dob = dateMomentObject.toDate(); // convert moment.js object to Date object

    let yearDob = dob.getFullYear();
    let monthDob = dob.getMonth();
    let dateDob = dob.getDate();

    let ageString: any = "";
    let yearString = "";
    let monthString = "";
    let dayString = "";

    let yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }


    let age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    if (age.years > 1) yearString = " Y,";
    else yearString = " Y,";
    if (age.months > 1) monthString = " M,";
    else monthString = " M,";
    if (age.days > 1) dayString = " D";
    else dayString = " D";

    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.months + monthString + " " + age.days + dayString + "";
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = " " + age.days + dayString + " ";
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " " + age.months + monthString + "";
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " " + age.days + dayString + "";
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.days + dayString + "";
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString + " ";
    else ageString = "";

    return ageString;
  }

}