import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './modules/public/landing-page/landing-page.component';
import { LoginComponent } from './components/login-register/login/login.component';
import { AccountTypeComponent } from './components/login-register/account-type/account-type.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AppMainComponent } from './containers/module-layout/app.main.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'public',
        pathMatch: 'full'
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            {
                path: 'public',
                loadChildren: () =>
                    import('./modules/public/public.module').then(
                        (m) => m.PublicModule
                    )
            }
        ]
    },
    {
        path: 'authentication',
        component: DefaultLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'account-type',
                component: AccountTypeComponent
            }
        ]
    },
    {
        path: 'admin',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import(
                        './modules/administration/administration.module'
                    ).then((m) => m.AdministrationModule)
            }
        ]
    },
    {
        path: 'a',
        component: LandingPageComponent
    },
    {
        path: 'b',
        component: AccountTypeComponent
    },
    {
        path: 'c',
        component: LoginComponent
    },
    {
        path: 'd',
        component: AppMainComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
