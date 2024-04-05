import { Injectable } from "@angular/core";

import { LocalStorageService } from "./local-storage.service";
import { LocalStorageType, SystemEnvironments } from "./../enums";
import { CurrentUserService } from "./current-user.service"

@Injectable()
export class LocationFormattedService {

    constructor(
        private currentUserService: CurrentUserService
    ) {

    }

    setTimeFormats(id: Number){
        let userLocation =  this.currentUserService.getCurrentUserLocationDetails();

        let location = userLocation.find(item => {
            return item.id == id
         });

         let is24H = location.generalSetting?.is24Hour;

        if(is24H){
            return {
                moment : "HH",
                default : "HH:mm",
                material : 24
            }
        }
        else{
            return {
                moment : "LT",
                default : "hh:mm A",
                material : 12
            }
        }
    }
}