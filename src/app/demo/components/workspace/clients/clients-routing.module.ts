import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientsListComponent} from "./clients-list/clients-list.component";
import {ClientsListV2Component} from "./clients-list-v2/clients-list-v2.component";

const routes: Routes = [
    {path : '', component: ClientsListComponent},
    {path : 'V2', component: ClientsListV2Component},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
