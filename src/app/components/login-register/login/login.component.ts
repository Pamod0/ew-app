import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { Message, MessageService } from 'primeng/api';

import { RecordStatus, SeverityLevel } from '../../../shared/enums/index';
import { LoginService } from './login.service';
import {
    CurrentUserService,
    UIMessageService,
    AuthenticationService
} from '../../../shared/services/index';
import { SignalrService } from '../../../signalr.service';
import { EnvService } from '../../../env.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string = '';
    activationKey: string = '';
    indicator: string = '';
    _version: string;
    _loginType: string = '';
    _isAttorney: boolean = false;
    infoMessage = '';
    attorney_registered = '';

    constructor(
        public env: EnvService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private spinner: NgxSpinnerService,
        private uiMessageService: UIMessageService,
        private loginService: LoginService,
        private currentUserService: CurrentUserService,
        private authenticationService: AuthenticationService,
        private signalrService: SignalrService
    ) {
        this._version = env.version;
    }

    ngOnInit() {
        // this.route.queryParams.subscribe((params) => {
        //     if (
        //         params.registered !== undefined &&
        //         params.registered === 'true'
        //     ) {
        //         this.attorney_registered = 'true';
        //         alert(
        //             'In order  to verify your email address, we have sent you an email. Please open the email and click on the provided link within 24 hours. After that login to your account.'
        //         );
        //         //this.infoMessage = 'In order  to verify your email address, we have sent you an email. Please open the email and click on the provided link within 1 hour. After that login to your account.';
        //     }
        // });

        this.loginForm = this.formBuilder.group({
            userId: ['', Validators.required],
            password: ['', Validators.required]
        });

        // this.returnUrl = this.route.snapshot.queryParams['returnurl'] || '/';

        // this.activationKey =
        //     this.route.snapshot.queryParams['activationkey'] || '';

        this.currentUserService.clearAuthenticationContext();

        // this._loginType = this.route.snapshot.queryParams['type'] || '';

        let loader = document.getElementById('loading');

        loader.style.display = 'none';

        // switch (this._loginType) {
        //     case 'attorney':
        //         this._isAttorney = true;
        //         break;
        // }
    }

    ngAfterViewInit(): void {}

    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.currentUserService.clearAuthenticationContext();
        if (this.loginForm.invalid) {
            this.uiMessageService.information(
                'All required fields must be filled'
            );

            return;
        }

        this.spinner.show();

        //this.router.navigate(['/dashboard']);

        this.authenticationService
            .login(
                this.f.userId.value,
                this.f.password.value,
                this.activationKey
            )
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(
                (response) => {
                    let authenticationContext = JSON.parse(
                        JSON.stringify(response || null)
                    );

                    console.log(authenticationContext);

                    this.currentUserService.setTokenContext(
                        authenticationContext
                    );

                    //authenticationContext.userTypeId = 3;

                    let urlPrams = this.returnUrl.split('?', 2);
                    if (
                        authenticationContext?.is_first_login ||
                        authenticationContext?.is_first_login == null
                    ) {
                        //this.router.navigate([urlPrams[0]]);
                        this.router.navigate([
                            '/authentication/change-password'
                        ]);
                    } else {
                        if (authenticationContext?.userTypeId == 11) {
                            this.router.navigate(['/gate']);
                        } else {
                            console.log('navigating to public');
                            this.router.navigate(['/public']);
                        }
                    }

                    //this.router.navigate(['/gate']);

                    //if there is a return url navigate
                },
                (error) => {
                    console.log(error);

                    this.uiMessageService.error(
                        'The user name or password are incorrect'
                    );
                }
            );
    }

    attorneySignUp() {
        this.router.navigateByUrl('/authentication/registerAttorney');
        //_returnUrl.includes('/')
    }
    attorneyDashboard() {}
}
