import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectListComponent} from "./project-list/project-list.component";
import {AuthGuard} from "../../../../guards/auth.guard";
import {ProjectDetailComponent} from "./project-detail/project-detail.component";

const routes: Routes = [
    { path: '', component: ProjectListComponent, canActivate: [AuthGuard], data: {roles: ['PROJECT_MANAGER', 'DIRECTOR']} },
    { path: ':id', component: ProjectDetailComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
