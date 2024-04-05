import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { CurrentUserService, UIMessageService } from './shared/services'
import { Router, NavigationStart } from '@angular/router';
import { EnvService } from './env.service';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    connection: signalR.HubConnection;
    //receiveTaskStatus: BehaviorSubject<string>;
    receiveTaskStatus: Subject<any>;
    private keepAfterRouteChange = false;
    private _hubUrl = '';

    constructor(private currentUserService: CurrentUserService,
        private router: Router,
        private UIMessageService: UIMessageService, private env: EnvService) {
        this.receiveTaskStatus = new BehaviorSubject<any>(null);
        this._hubUrl = env.hubUrl;
    }

    // Establish a connection to the SignalR server hub
    public initiateSignalrConnection(): Promise<any> {
        return new Promise<void>((resolve, reject) => {

            let _userId = this.currentUserService.getUserId();
            ////console.log(_userId);
            if (_userId == null) {
                resolve();
            }
            else {
                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl(this._hubUrl + "?user=" + _userId) // the SignalR server url as set in the .NET Project properties and Startup class
                    .build();

                this.setSignalrClientMethods();

                this.connection
                    .start()
                    .then(() => {
                        ////console.log(`SignalR connection success! connectionId: ${this.connection.connectionId} `);
                        resolve();
                    })
                    .catch((error) => {
                        ////console.log(`SignalR connection error: ${error}`);
                        reject();
                    });
            }

        });
    }

    // This method will implement the methods defined in the ISignalrDemoHub inteface in the SignalrDemo.Server .NET solution
    private setSignalrClientMethods(): void {


        this.connection.on('ReceiveTaskStatus', (message: string) => {
            ////console.log("ReceiveTaskStatus")
            let obj = JSON.parse(message);
            //this.receiveTaskStatus.next(obj.Message);
            this.keepAfterRouteChange = false;
            this.receiveTaskStatus.next({ type: 'warning', text: obj.Message });
        });
    }
}
