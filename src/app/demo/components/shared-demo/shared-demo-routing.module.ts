import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestButtonComponent} from "./test-button/test-button.component";
import {PlansManagementComponent} from "./plans-management/plans-management.component";

const routes: Routes = [
    { path: '', component: TestButtonComponent},
    { path: 'plans-management', component: PlansManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SharedDemoRoutingModule { }
