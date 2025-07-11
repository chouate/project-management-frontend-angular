import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'shared-demo', loadChildren: ()=> import('./demo/components/shared-demo/shared-demo.module').then(m => m.SharedDemoModule)},
                    { path: 'clients',   loadChildren: () => import('./demo/components/workspace/clients/clients.module').then(m => m.ClientsModule) },
                    { path: 'collaborators', loadChildren: () => import('./demo/components/workspace/collaborators/collaborators.module').then(m => m.CollaboratorsModule) },
                    { path: 'projects', loadChildren: () => import('./demo/components/workspace/projects/projects.module').then(m => m.ProjectsModule) },
                    { path: 'technologies', loadChildren: () => import('./demo/components/workspace/technologies/technologies.module').then(m => m.TechnologiesModule) },
                    { path: 'tasks', loadChildren: () => import('./demo/components/workspace/tasks/tasks.module').then(m => m.TasksModule) },


                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
