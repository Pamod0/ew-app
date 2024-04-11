import { Component, HostListener } from '@angular/core';
import { CaseList } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-cases-dashboard',
  templateUrl: './cases-dashboard.component.html',
  styleUrls: ['./cases-dashboard.component.scss']
})
export class CasesDashboardComponent {
  _innerHeight: any = '0px';
  caseLists: CaseList[];
  sidebarVisible: boolean = false;
  @HostListener('window : resize', ['$event'])
  onResize(event) {
    this._innerHeight = window.innerHeight + 'px';
  }
  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit() {
    this.dashboardService.getCaseLists().then(data => this.caseLists = data);
    this._innerHeight = window.innerHeight + 'px';
    this.dashboardService.displaySidebar$.subscribe(display => {
      this.sidebarVisible = display;
    });
  }
  

  createCase (){
    this.sidebarVisible=true;
  }
}
