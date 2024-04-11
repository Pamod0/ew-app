import { Component, HostListener } from '@angular/core';
import { TaskList } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss']
})
export class TasksDashboardComponent {
  taskLists: TaskList[];
  _innerHeight: any = '0px';

  @HostListener('window : resize', ['$event'])
  onResize(event) {
    this._innerHeight = window.innerHeight + 'px';
  }

  constructor(private dashboardService: DashboardService) {

  }
  ngOnInit() {
    this.dashboardService.getTaskLists().then(data => this.taskLists = data);   
    this._innerHeight = window.innerHeight + 'px'; 
  }
}
