import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CollaboratorListComponent} from "./collaborator-list/collaborator-list.component";
import {AuthGuard} from "../../../../guards/auth.guard";

const routes: Routes = [
    {path: '', component: CollaboratorListComponent, canActivate: [AuthGuard], data: {roles: ['PROJECT_MANAGER', 'DIRECTOR', 'DEVELOPER']}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaboratorsRoutingModule { }
