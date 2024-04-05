import ticksToDate from "ticks-to-date";
import * as moment from "moment";

export class TwentyFourHourTimeStringToTime {

    static transform(timeString: string): any {
        
        let timeTicks =
            (Number(timeString.split(":")[0]) * 60 * 60 * 1000 +
                Number(timeString.split(":")[1]) * 60 * 1000) *
            10000;        

        let time = new Date(
            moment
                .utc(
                    ticksToDate(timeTicks)
                )
                .format("LLLL")
        );

        return time;
    }
}