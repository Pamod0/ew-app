import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-dashboard.component.html',
  styleUrls: ['./list-dashboard.component.scss']
})
export class ListDashboardComponent {
  deleteUserDialog: boolean = false;
  _innerHeight: any = '0px';

  @HostListener('window : resize', ['$event'])
  onResize(event) {
    this._innerHeight = window.innerHeight + 'px';
  }
  ngOnInit() {
    this._innerHeight = window.innerHeight + 'px';
    
  }

  
}
