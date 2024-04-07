import {
    Component,
    AfterViewInit,
    OnDestroy,
    Renderer2,
    OnInit
} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppComponent } from '../../app.component';
import { UIMessageService } from '../../shared/services/ui-message.service';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html',
})
export class AppMainComponent implements AfterViewInit, OnDestroy, OnInit {
    activeTabIndex = -1;

    sidebarActive = false;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rotateMenuButton: boolean;

    sidebarClick: boolean;

    topbarItemClick: boolean;

    menuButtonClick: boolean;

    activeTopbarItem: any;

    documentClickListener: () => void;

    configActive: boolean;

    configClick: boolean;

    constructor(
        public renderer: Renderer2,
        private primengConfig: PrimeNGConfig,
        public app: AppComponent
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listen(
            'body',
            'click',
            (event) => {
                if (!this.topbarItemClick) {
                    this.activeTopbarItem = null;
                    this.topbarMenuActive = false;
                }

                if (
                    !this.menuButtonClick &&
                    !this.sidebarClick &&
                    (this.overlay || !this.isDesktop())
                ) {
                    this.sidebarActive = false;
                }

                if (this.configActive && !this.configClick) {
                    this.configActive = false;
                }

                this.configClick = false;
                this.topbarItemClick = false;
                this.sidebarClick = false;
                this.menuButtonClick = false;
            }
        );
    }

    onTabClick(event: Event, index: number) {
        if (this.activeTabIndex === index) {
            this.sidebarActive = !this.sidebarActive;
        } else {
            this.activeTabIndex = index;
            this.sidebarActive = true;
        }

        event.preventDefault();
    }

    closeSidebar(event: Event) {
        this.sidebarActive = false;
        event.preventDefault();
    }

    onSidebarClick(event: Event) {
        this.sidebarClick = true;
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        event.preventDefault();
    }

    onMenuButtonClick(event: Event, index: number) {
        this.menuButtonClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.sidebarActive = !this.sidebarActive;

        if (this.app.layoutMode === 'overlay') {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive =
                    !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        if (this.activeTabIndex < 0) {
            this.activeTabIndex = 0;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSearchItemClick(event: Event) {
        this.topbarItemClick = true;

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    get overlay(): boolean {
        return this.app.layoutMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
}
