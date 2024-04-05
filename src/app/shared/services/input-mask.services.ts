import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageType, SystemEnvironments } from './../enums';
import { EnvService } from 'src/app/env.service';
import { map } from 'rxjs/operators';
import { createMask } from '@ngneat/input-mask';

@Injectable()
export class InputMaskService {
    constructor(
    ) {

    }


    getDateMask(){

        let datePicker;
        datePicker = createMask<Date>({
            alias: 'datetime',
            inputFormat: 'dd/mm/yyyy',
            placeholder: 'dd/mm/yyyy'

        });
        return datePicker;
    }
    
    getTimeMask(isTwelveHour) {

        let timeInputMask;

        if (!isTwelveHour) {

            timeInputMask = createMask<Date>({
                alias: 'datetime',
                inputFormat: 'HH:MM',
                placeholder: '__ : __'

            });
        }
        else {
            console.log('aa');

            timeInputMask = createMask<Date>({
                alias: 'datetime',
                inputFormat: 'hh : MM TT',
                placeholder: '__ : __ __'

            });
        }

        return timeInputMask;
    }
}