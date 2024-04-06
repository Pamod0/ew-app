import { Pipe, PipeTransform } from "@angular/core";

import ticksToDate from "ticks-to-date";
import * as moment from "moment";

@Pipe({
  name: "tickToTime",
})

export class TickToTimePipe implements PipeTransform{

  transform(value: any): any {
    if (value != null || value != undefined){
      var t = moment
                .utc(
                    ticksToDate(
                        Number(value.ticks)
                    ).toUTCString()
                )
                .format("HH:mm")
            // var l = moment(t).local().format('MM/DD/YYYY hh:mm:ss');
            return t;
        } else {
            return "";
        }

    }

  }


