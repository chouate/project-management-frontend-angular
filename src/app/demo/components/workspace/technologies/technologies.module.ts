import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechnologiesRoutingModule } from './technologies-routing.module';
import { TechnologyListComponent } from './technology-list/technology-list.component';
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TooltipModule} from "primeng/tooltip";
import {ConfirmDialogModule} from "primeng/confirmdialog";


@NgModule({
  declarations: [
    TechnologyListComponent
  ],
    imports: [
        CommonModule,
        TechnologiesRoutingModule,
        TableModule,
        ToastModule,
        DialogModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        TooltipModule,
        InputTextareaModule,
    ]
})
export class TechnologiesModule { }
