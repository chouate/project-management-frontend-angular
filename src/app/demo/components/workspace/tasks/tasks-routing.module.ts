import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../../../../guards/auth.guard";
import {TaskListComponent} from "./task-list/task-list.component";

const routes: Routes = [
    { path: 'my-tasks', component: TaskListComponent, canActivate: [AuthGuard], data: {roles: ['PROJECT_MANAGER', 'DIRECTOR', 'DEVELOPER']} },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
