import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../../../guards/auth.guard";
import {TechnologyListComponent} from "./technology-list/technology-list.component";

const routes: Routes = [
    { path: '', component: TechnologyListComponent, canActivate: [AuthGuard], data: {roles: ['PROJECT_MANAGER', 'DIRECTOR']} },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnologiesRoutingModule { }
