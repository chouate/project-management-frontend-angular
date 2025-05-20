import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientsListComponent} from "./clients-list/clients-list.component";
import {ClientsListV2Component} from "./clients-list-v2/clients-list-v2.component";
import {AuthGuard} from "../../../../guards/auth.guard";

const routes: Routes = [
    {path : '', component: ClientsListV2Component, canActivate: [AuthGuard], data: {roles: ['DIRECTOR']}},
    {path : 'V2', component: ClientsListComponent, canActivate: [AuthGuard], data: {roles: ['DIRECTOR']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
