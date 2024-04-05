import { Injectable } from "@angular/core";

import { LocalStorageService } from "./local-storage.service";
import { LocalStorageType, SystemEnvironments } from "./../enums";

@Injectable()
export class CommonService {
    constructor(private localStorageService: LocalStorageService) {

    }

    getNextNumberRange(incrementBy :any, limit : any){

        let array = [];

        for (let index = 0; index < limit; index++) {
            
            let value = incrementBy + (incrementBy * index);
            array.push(value);            
        }

        return array;
    }
}
