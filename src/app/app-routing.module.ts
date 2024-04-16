import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './modules/public/landing-page/landing-page.component';
import { LoginComponent } from './components/login-register/login/login.component';
import { AccountTypeComponent } from './components/login-register/account-type/account-type.component';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AppMainComponent } from './containers/module-layout/app.main.component';
import { RegisterCommunityComponent } from './components/login-register/register/register-community/register-community.component';

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
                path: '',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                './components/login-register/login-register.module'
                            ).then((m) => m.LoginRegisterModule)
                    }
                ]
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
        path: 'home',
        component: LandingPageComponent
    },
    {
        path: 'c',
        component: AccountTypeComponent
    },
    {
        path: 'b',
        component: LoginComponent
    },
    {
        path: 'd',
        component: RegisterCommunityComponent
    },
    {
        path: 'z',
        component: AppMainComponent
    },
    {
        path: '**',
        redirectTo: 'public'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
