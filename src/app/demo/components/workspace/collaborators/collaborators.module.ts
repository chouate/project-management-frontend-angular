import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import {ButtonModule} from "primeng/button";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {OrderListModule} from "primeng/orderlist";
import {PickListModule} from "primeng/picklist";
import {RatingModule} from "primeng/rating";
import {SharedModule} from "primeng/api";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ListboxModule} from "primeng/listbox";
import {DialogModule} from "primeng/dialog";


@NgModule({
  declarations: [
    CollaboratorListComponent
  ],
    imports: [
        CommonModule,
        CollaboratorsRoutingModule,
        ButtonModule,
        DataViewModule,
        DropdownModule,
        InputTextModule,
        OrderListModule,
        PickListModule,
        RatingModule,
        SharedModule,
        FormsModule,
        MultiSelectModule,
        ListboxModule,
        DialogModule
    ]
})
export class CollaboratorsModule { }
