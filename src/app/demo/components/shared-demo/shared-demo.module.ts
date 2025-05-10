import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedDemoRoutingModule } from './shared-demo-routing.module';
import { TestButtonComponent } from './test-button/test-button.component';

import { ModalComponent } from './modal/modal.component';

import { PlansManagementComponent } from './plans-management/plans-management.component';
import {DynamicTableEditCellComponent} from "./dynamic-table-edit-cell/dynamic-table-edit-cell.component";
import {AbstractSearchComponent} from "./abstract-search/abstract-search.component";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        TestButtonComponent,
        ModalComponent,
        DynamicTableEditCellComponent,
        PlansManagementComponent
    ],
    imports: [
        CommonModule,
        SharedDemoRoutingModule,
        TableModule,
        DialogModule,
        ConfirmDialogModule,
        InputSwitchModule,
        FormsModule,
        CheckboxModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        HttpClientModule
    ],
    exports: [
        DynamicTableEditCellComponent
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})
export class SharedDemoModule { }
