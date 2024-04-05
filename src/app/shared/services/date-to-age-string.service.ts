import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

import { Observable, throwError } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";
import { EnvService } from "src/app/env.service";


@Injectable()
export class DateToAgeStringService {

   private _baseUrl = '';
  // private _apiUrl = `${this._baseUrl}/GeneralManagement/DataGroups`;

  constructor(private http: HttpClient, private env: EnvService) { 
    this._baseUrl = env.baseApiUrl;
  }

  getAge(date: any): Observable<any> {

    /*  let today = new Date();
     let birthday = new Date(value);

     let userAgeYear=(today.getFullYear()-birthday.getFullYear());
     let userAgeMonths=(today.getMonth()-birthday.getMonth());
     let userAgeDays=(today.getDay()-birthday.getDay());
*/
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let yearNow = now.getFullYear();
    let monthNow = now.getMonth();
    let dateNow = now.getDate();

    /* let dob = new Date(userAge.substring(6,10),
                       userAge.substring(0,2)-1,                   
                       userAge.substring(3,5)                  
                       ); */

    let dob = new Date(date);

    let yearDob = dob.getFullYear();
    let monthDob = dob.getMonth();
    let dateDob = dob.getDate();
    //let age = {};
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

    if (age.years > 1) yearString = "Y";
    else yearString = "Y";
    if (age.months > 1) monthString = "M";
    else monthString = "M";
    if (age.days > 1) dayString = "D";
    else dayString = "D";

    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.months + monthString + " " + age.days + dayString + " ";
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = " " + age.days + dayString + " ";
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " " + age.months + monthString + "";
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " " + age.days + dayString + " ";
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " " + age.days + dayString + " ";
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString + " ";
    else ageString = "";

     /* return this.http.get(this._apiUrl + "/GenarateSSN").pipe(
            map((response: any) => {
                return response.data;
            })
        ); */

    return ageString;

  }


}