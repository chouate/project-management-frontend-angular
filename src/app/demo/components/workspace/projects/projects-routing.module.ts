import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectListComponent} from "./project-list/project-list.component";
import {AuthGuard} from "../../../../guards/auth.guard";

const routes: Routes = [
    { path: '', component: ProjectListComponent, canActivate: [AuthGuard], data: {roles: ['PROJECT_MANAGER', 'DIRECTOR']} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
