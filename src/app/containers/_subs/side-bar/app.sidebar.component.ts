import {Component} from '@angular/core';
import { AppMainComponent } from '../../module-layout/app.main.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
})
export class AppSideBarComponent {

    constructor(public app: AppMainComponent) {}

}
