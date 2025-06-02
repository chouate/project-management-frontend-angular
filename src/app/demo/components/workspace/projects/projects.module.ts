import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
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
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import {ChartModule} from "primeng/chart";
import {CardModule} from "primeng/card";
import {TabMenuModule} from "primeng/tabmenu";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {InputTextareaModule} from "primeng/inputtextarea";


@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectDetailComponent
  ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,
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

        TabMenuModule,
        CardModule,
        ChartModule,
        CalendarModule,
        DialogModule,
        InputTextareaModule,


    ]
})
export class ProjectsModule { }
