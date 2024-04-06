import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UIMessageService } from './../../services';
import { Message, MessageService } from 'primeng/api';
import { RecordStatus, SeverityLevel } from './../../enums';
import { Subscription } from 'rxjs';
import { SignalrService } from './../../../signalr.service';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'ui-message',
  templateUrl: './ui-message.component.html',
  styleUrls: ['ui-message.component.css'],
})
export class UIMessageComponent implements OnInit, OnDestroy {
  hubHelloMessage: string;
  progressPercentage: number;
  progressMessage: string;
  processing: boolean;
  messageText: any;
  private subscription: Subscription;
  private subscriptionSignalR: Subscription;

  constructor(
    private uiMessageService: UIMessageService,
    private messageService: MessageService,
    public signalrService: SignalrService
  ) {
    this.subscriptionSignalR = this.signalrService.receiveTaskStatus.subscribe(
      (message: any) => {
        if (message) {
          //console.log(message);
          this.messageText = message;
          this.checkedMessge(message);
        }
      }
    );

    this.subscription = this.uiMessageService.commonMessageSubject.subscribe(
      (message: any) => {
        if (message) {
          //console.log(message);
          this.messageText = message;
          this.checkedMessge(message);
        }
      }
    );
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionSignalR.unsubscribe();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  checkedMessge(message: any) {
    //console.log("checkedMessge");
    switch (message && message.type) {
      case 'success':
        this.showMessage(SeverityLevel.Success, message.text);
        break;
      case 'error':
        this.showMessage(SeverityLevel.Error, message.text);
        break;
      case 'information':
        this.showMessage(SeverityLevel.Information, message.text);
        break;
      case 'warning':
        this.showMessage(SeverityLevel.Warning, message.text);
        break;
    }
  }

  showMessage(severityLevel: any, message: string) {
    //console.log('showMessage')
    this.messageText = message;

    let severity = '',
      summary = '';

    switch (severityLevel) {
      case SeverityLevel.Information: {
        severity = 'info';
        summary = 'Information';
        break;
      }
      case SeverityLevel.Warning: {
        severity = 'warn';
        summary = 'Warning';
        break;
      }
      case SeverityLevel.Error: {
        severity = 'error';
        summary = 'Error';
        break;
      }
      case SeverityLevel.Success: {
        severity = 'success';
        summary = 'Success';
        break;
      }
      default: {
        severity = 'info';
        summary = 'System Message';
        break;
      }
    }

    try {
      this.messageService.add({
        key: 'toastKey',
        severity: severity,
        summary: summary,
        detail: message,
        // sticky: true,
        life:	5000,      
      });
    } catch (e) {
      //console.log(e);
    }
  }
}
