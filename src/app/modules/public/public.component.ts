import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AppComponent } from '../../app.component';

import {
    CurrentUserService,
    UIMessageService,
    PermissionService
} from '../../shared/services/index';
import { EnvService } from '../../env.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-public',
    template: ``,
    styles: ``
})
export class PublicComponent implements OnInit {
    modules: any[] = [];
    company: any;
    systemEnvironment: string;
    _spinner: string = 'dashboardSpinner';

    userGroupID: number = 0;

    private router: Router;

    constructor(
        public renderer: Renderer2,
        public env: EnvService,
        private primengConfig: PrimeNGConfig,
        private currentUserService: CurrentUserService,
        private uiMessageService: UIMessageService,
        private spinner: NgxSpinnerService,
        public app: AppComponent,
        private permissionService: PermissionService,
        router: Router
    ) {
        this.router = router;
    }

    ngOnInit(): void {
        console.log('public component loaded');
        this.spinner.show(this._spinner);
        if (this.currentUserService.getCurrentUser()) {
            this.loadUserData();
        } else {
            this.getAuthUser();
        }
        //this.router.navigate(['/' + 1 + '/0/dashboardAttorney']);
        //   this.router.navigate(['/' + 1 + '/0']);
    }

    getAuthUser() {
        this.currentUserService
            .getAuthUser()
            .pipe(finalize(() => {}))
            .subscribe(
                (response) => {
                    console.log(response);
                    let authenticationContext = JSON.parse(
                        JSON.stringify(response || null)
                    );
                    console.log(
                        ' this.authenticationContext',
                        authenticationContext
                    );
                    this.currentUserService.setAuthenticationContext(
                        authenticationContext
                    );
                    this.userGroupID = response.userGroupId;
                    this.loadUserData();
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    loadUserData() {
        this.company = this.currentUserService.getCompanyInformation();

        //let _authorizedModuleList = this.currentUserService.getAccessDetails();

        //this.company = this.currentUserService.getCompanyInformation();
        //let _userAccessDashboards = this.currentUserService.getAccessDetails();

        //this.systemEnvironment = this.currentUserService.getSystemEnvironment();
        //console.log("System Environment",this.systemEnvironment);

        //this.modules = _userAccessDashboards.sort((a, b) =>
        //  a.sortOrder > b.sortOrder ? 1 : b.sortOrder > a.sortOrder ? -1 : 0
        //);

        // this.permissionService.removeUserPermissions();

        //this.permissionService.setUserPermissions();

        this.spinner.hide(this._spinner);

        //this.openModule(1);
        // this.router.navigate(['/' + 1 + '/0']);
        this.router.navigate(['/' + 'admin' + '/0']);
    }

    openModule(id: any) {
        let access = this.currentUserService.getAccessDetails();
        let _selectedModule = access.find((a) => a.id == Number(id));

        if (_selectedModule.screens == null) {
            this.currentUserService
                .getAccessModuleScreens(id)
                .pipe(finalize(() => {}))
                .subscribe(
                    (response) => {
                        console.log(response);
                        _selectedModule.screens = response.data;

                        console.log('accessaccess', access);
                        console.log(
                            '_selectedModule_selectedModule',
                            _selectedModule
                        );

                        this.currentUserService.setAccessList(access);

                        if (this.userGroupID === 2) {
                            this.router.navigate([
                                '/' + id + '/0/dashboardAttorney'
                            ]);
                        } else {
                            // this.router.navigate(['/' + id + '/0']);
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        } else {
            // this.router.navigate(['/' + id + '/0']);
        }
    }
}
