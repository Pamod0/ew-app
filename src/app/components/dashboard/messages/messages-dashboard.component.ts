import { Component, HostListener } from '@angular/core';
import { MessageLists } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-messages-dashboard',
  templateUrl: './messages-dashboard.component.html',
  styleUrls: ['./messages-dashboard.component.scss']
})
export class MessagesDashboardComponent {
  messageLists: MessageLists[];
  _innerHeight: any = '0px';

  @HostListener('window : resize', ['$event'])
  onResize(event) {
    this._innerHeight = window.innerHeight + 'px';
  }
  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit() {
    this.dashboardService.getMessageLists().then(data => this.messageLists = data);
    this._innerHeight = window.innerHeight + 'px';
  }
}
