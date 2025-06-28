import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {SliderModule} from "primeng/slider";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {TabMenuModule} from "primeng/tabmenu";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";


@NgModule({
  declarations: [
    TaskListComponent
  ],
    imports: [
        CommonModule,
        TasksRoutingModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        MultiSelectModule,
        ProgressBarModule,
        RatingModule,
        RippleModule,
        SharedModule,
        SliderModule,
        TableModule,
        ToastModule,
        ToggleButtonModule,
        FormsModule,
        ToastModule,
        TabMenuModule,
        CardModule,
        ChartModule,
        CalendarModule,
        DialogModule,
        InputTextareaModule,
        InputNumberModule,
    ]
})
export class TasksModule { }
