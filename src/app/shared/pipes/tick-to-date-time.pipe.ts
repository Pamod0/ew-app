import { Pipe, PipeTransform } from "@angular/core";

import ticksToDate from "ticks-to-date";
import * as moment from "moment";

@Pipe({
    name: "tickToDateTime",
})
export class TickToDateTimePipe implements PipeTransform {
    transform(value: any): any {
        if (value != null || value != undefined) {
            var t = moment
                .utc(
                    ticksToDate(
                        Number(value.ticks)
                    ).toUTCString()
                )
                .format("YYYY-MM-DD HH:mm:ss")
            // var l = moment(t).local().format('MM/DD/YYYY hh:mm:ss');
            return t;
        } else {
            return "";
        }
    }
}
