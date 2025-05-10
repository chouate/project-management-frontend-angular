import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsListComponent } from './clients-list/clients-list.component';
import {SharedDemoModule} from "../../shared-demo/shared-demo.module";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {RadioButtonModule} from "primeng/radiobutton";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import { ClientsListV2Component } from './clients-list-v2/clients-list-v2.component';
import {TimelineModule} from "primeng/timeline";
import {CalendarModule} from "primeng/calendar";


@NgModule({
  declarations: [
    ClientsListComponent,
    ClientsListV2Component,
  ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        SharedDemoModule,
        ToastModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        FileUploadModule,
        FormsModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        TableModule,
        ToolbarModule,
        TimelineModule,
        CalendarModule,
        // pour utiliser <dynamic-table-demo>

    ]
})
export class ClientsModule { }
