import ticksToDate from "ticks-to-date";
import * as moment from "moment";

export class TwentyFourHourTimeStringToTicks {

    static transform(timeString: string): any {
        
        let ticks =
            (Number(timeString.split(":")[0]) * 60 * 60 * 1000 +
                Number(timeString.split(":")[1]) * 60 * 1000) *
            10000;        

        return ticks;
    }
}