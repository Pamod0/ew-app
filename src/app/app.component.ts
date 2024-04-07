import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'mepa';

    layoutMode = 'static';
    theme = 'green';
    inputStyle = 'outlined';
    ripple: boolean;

    constructor(private router: Router, private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

        this.primengConfig.ripple = true;
        this.ripple = true;
    }
}
