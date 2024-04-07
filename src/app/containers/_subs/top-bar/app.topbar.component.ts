import { Component, Renderer2 } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { AppMainComponent } from '../../module-layout/app.main.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

import { CurrentUserService } from '../../../shared/services/current-user.service';
// import { LogInComponent } from 'src/app/components/security/login.component';
import { style } from '@angular/animations';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    items: MenuItem[] = [];
    showMegaMenu: boolean = false;
    
    // sidebarActive = false;
    // documentClickListener: () => void;

    constructor(
        private currentUserService: CurrentUserService, 
        public app: AppComponent, 
        public appMain: AppMainComponent,
        public router:Router,
        public renderer: Renderer2,
    ) {}

    ngOnInit() {
    this.items = [
        {
            label: 'Customers',
            // icon: 'pi pi-fw pi-users',
             routerLink: ['customers']
            // items: [
            //     {label: 'New', icon: 'pi pi-fw pi-plus'},
            //     {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
            // ]
        },
        {
            label: 'Kase',
            // icon: 'pi pi-fw pi-users',
             routerLink: ['case']
            // items: [
            //     {label: 'New', icon: 'pi pi-fw pi-plus'},
            //     {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
            // ]
        }
    ];

    }

    onTopbarLogoutClick(event: Event, item) {
        console.log(event);
        event.preventDefault();
        this.currentUserService.clearAuthenticationContext();
        this.router.navigate(['/authentication/login']);
        console.log(event);
        
      }

    dashboard(){
        this.router.navigate(['dashboard']);
    }
    signout(){
        this.router.navigate(['login']);
    }

    showMegaMenuBtn() {
        this.showMegaMenu = !this.showMegaMenu;
    }

}
