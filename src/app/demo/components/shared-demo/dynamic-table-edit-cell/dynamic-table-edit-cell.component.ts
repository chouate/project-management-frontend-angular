import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerService} from '../../../service/customer.service';
import {ProductService} from '../../../service/product.service';
import {Table} from 'primeng/table';
import {ConfirmationService} from 'primeng/api';
import {Plan} from "../../../api/plan";
//import {GenericTable} from 'src/app/demo/service/generic.table.service';
//import {Plan} from 'src/app/demo/api/plan';

//import {ValidatorType} from "../../enums/enums";

interface expandedRows {
    [key: string]: boolean;
}
 enum ActionType{
    ADD="add",
    EDIT="edit",
    REMOVE="remove",
    DUPLICATE="duplicate"
}

@Component({
    selector:'dynamic-table-demo',
    templateUrl: './dynamic-table-edit-cell.component.html',
    styleUrls: ['./dynamic-table-edit-cell.component.scss'],
})
export class DynamicTableEditCellComponent implements OnInit {
    /**
     * Meta data inputs
     */
    @Input() tableName:string="Table of orders";
    @Input() pageRows:number=15;
    @Input() cols:any[];

    /**
     * Meta data atributes
     */
    globalFilterFields: string[] = [];
    loading: boolean = true;
    displayModal = false;
    modalData ={};
    modalConfig:any[]=[];
    modalEditable=false;
    tabToEditSwitch:boolean=true;
    multipleSelectionSwitch:boolean=true;
    isAllSelected: boolean = false;

    /**
     * data inputs
     */
    @Input() data:any[];
    @Input() originalData: any[]
    /**
     * data attributes
     */
    //originalData: any[] = []; //to mark unsaved data
    plans:Plan[]=[];
    statuses: any[] = [];
    detailsId:any=0;
    changesExists:boolean=false;
    changedRows: any[] = [];
    selectedDataRow: any[] = []; // Store selected rows
    removedData:any[]=[];

    /**
     * Local references
     */
    @ViewChild('modalRef') modalComponent: any;
    @ViewChild('filter') filter!: ElementRef;

    /**
     * outputs for actions
     * @param id
     */
    @Output() save = new EventEmitter<{ type: string, data?: any }>();
    @Output() remove = new EventEmitter<{ type: string, data?: any }>();
    @Output() edit = new EventEmitter<{ type: string, data?: any }>();


    validationErrors: { [index: number]: { [field: string]: string } } = {};

    validateField(value: any, col: any, rowIndex: number) {
        const errors: { [field: string]: string } = this.validationErrors[rowIndex] || {};
        let hasError = false;

        if (col.validators) {
            for (let validator of col.validators) {
                const numericValue = parseFloat(value); // Ensure correct comparison

                switch (validator.type) {
                    case 'REQUIRED':
                    case 2:
                        if (value == null || value === '') {
                            errors[col.field] = `${col.header} is required.`;
                            hasError = true;
                        } else {
                            delete errors[col.field];
                        }
                        break;

                    case 'MIN':
                    case 1:
                        if (!isNaN(numericValue) && numericValue < validator.value) {
                            errors[col.field] = `${col.header} must be ≥ ${validator.value}.`;
                            hasError = true;
                        } else {
                            delete errors[col.field];
                        }
                        break;

                    case 'MAX':
                    case 0:
                        if (!isNaN(numericValue) && numericValue > validator.value) {
                            errors[col.field] = `${col.header} must be ≤ ${validator.value}.`;
                            hasError = true;
                        } else {
                            delete errors[col.field];
                        }
                        break;
                }

                if (hasError){
                    //this.data[rowIndex].hasError=col.field;
                    break;
                } // stop on first error
            }
        }

        this.validationErrors[rowIndex] = { ...errors };
    }

    handleEnter(event: KeyboardEvent, value: any, col: any, rowIndex: number) {
        this.validateField(value, col, rowIndex);

        if (this.validationErrors[rowIndex]?.[col.field]) {
            event.preventDefault(); // Stop Enter key behavior

            // Ensure focus returns after possible DOM update
            setTimeout(() => {
                const inputId = `${col.filterType}_${col.field}_${rowIndex}`;
                const inputEl = document.getElementById(inputId);
                if (inputEl) inputEl.focus();
            });
        }
    }

    moveValidationErrorsToTop(rowIndex: number) {
        // Step 1: Save the original row errors (if you need to preserve them)
        const originalRowErrors = this.validationErrors[rowIndex];

        // Step 2: Remove the row errors from validationErrors
        delete this.validationErrors[rowIndex];

        // Step 3: Create a new object for validationErrors with the new rowIndex
        const newValidationErrors = { 0: originalRowErrors };  // Put it at index 0

        // Step 4: Shift the other rows down by 1 index
        Object.keys(this.validationErrors).forEach(key => {
            const newIndex = parseInt(key, 10) + 1;  // Increment each index by 1
            newValidationErrors[newIndex] = this.validationErrors[key];
        });

        // Step 5: Assign the updated object to validationErrors
        this.validationErrors = newValidationErrors;
    }


    getMultiSelectLabels(values: any[], optionLabel: string): string {
        if (!values || !Array.isArray(values)) return '';
        return values.map(val => this.isObject(val) ? val[optionLabel] : val).join(', ');
    }

    getNestedValue(obj: any, path: string): any {
        if (!obj || !path) return null;
        return path.split(/[\.\[\]'\"]+/).filter(Boolean).reduce((acc, key) => acc?.[key], obj);
    }

    isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    showDialog(id) {
        this.detailsId=id;
        this.modalData = this.getDataForDetail();
        this.modalConfig = this.cols.filter(col => col.filterType !== 'modal' && col.filterType !== 'systemStatus');
        this.modalEditable = true;
        //console.log(this.modalData);
        setTimeout(() => {
            this.displayModal = true;
            this.cd.detectChanges();
        }, 0);
    }
    duplicate(originalItem: any) {
        const newItem = { ...originalItem };
        newItem.unsaved = true;
        newItem.actionType=ActionType.DUPLICATE;
        this.data.unshift(newItem);
    }

    rollback(rowIndex: number): void {
        const currentRow = this.data[rowIndex];
        delete this.validationErrors[rowIndex];
        switch (currentRow.actionType) {
            case ActionType.ADD:
            case ActionType.DUPLICATE:
                this.data.splice(rowIndex, 1);
                return;
            default:break;
        }
        if (!currentRow || currentRow.originalIndex === undefined) return;
        const originalRow = this.originalData[rowIndex];
        if (!originalRow) return;
        const restoredRow = JSON.parse(JSON.stringify(originalRow)); // Deep clone
        restoredRow.unsaved = false;
        restoredRow.originalIndex = currentRow.originalIndex;
        // Remove the current row
        this.data.splice(rowIndex, 1);
        // Insert the restored row at its original position
        this.data.splice(restoredRow.originalIndex, 0, restoredRow);
        //this.originalData.splice(rowIndex, 1);
        //this.originalData.unshift(restoredRow.originalIndex, 0, restoredRow);
        // Remove from changedRows
        const indexInChanged = this.changedRows.findIndex(row => row.id === restoredRow.id);
        if (indexInChanged !== -1) {
            this.changedRows.splice(indexInChanged, 1);
        }
        this.evaluateGlobalChanges();
    }

    async setData(data: any[]): Promise<void> {
        this.data = await data.map(item => ({ ...item })); // your editable copy
        this.originalData = data.map(item => JSON.parse(JSON.stringify(item))); // deep copy for comparison
    }

    markUnsaved(row: any, rowIndex: number): void {
        const originalRow = this.originalData[rowIndex];
        if (!originalRow) {
            row.unsaved = true;
            return;
        }
        let isChanged = false;
        // Compare each field
        for (const key of Object.keys(originalRow)) {
            const colConfig = this.cols.find(col => col.field === key);
            if (colConfig?.filterType === 'dropdown') {
                const optionValue = row[colConfig.field][colConfig.optionLabel];
                isChanged = optionValue !== originalRow[colConfig.field];
            } else {
                if (typeof row[key] === 'object') {
                    isChanged = JSON.stringify(row[key]) !== JSON.stringify(originalRow[key]);
                } else {
                    isChanged = row[key] !== originalRow[key];
                }
            }
            if (isChanged) {
                console.log(`Key [${key}] changed:`, row[colConfig.field][colConfig.optionLabel], 'vs', originalRow[key]);
                break;
            }
        }

        row.unsaved = isChanged;
        if (isChanged) {
            if (!this.changedRows.includes(row)) {
                // Save original index only once
                row.originalIndex = rowIndex;
                // Remove from current position and unshift to top
                this.data.splice(rowIndex, 1);
                this.data.unshift(row);
                this.originalData.splice(rowIndex, 1);
                this.originalData.unshift(originalRow);
                this.moveValidationErrorsToTop(rowIndex);
                // this.validationErrors.splice(rowIndex, 1);
                // this.validationErrors.unshift(originalRow);
                this.changedRows.push(row);
            }
        } else {
            // Reverted changes
            const indexInChanged = this.changedRows.indexOf(row);
            if (indexInChanged !== -1) {
                this.changedRows.splice(indexInChanged, 1);
            }
            row.unsaved = false;
            // Only move back if it was previously moved
            if (row.originalIndex !== undefined) {
                const currentIndex = this.data.indexOf(row);
                if (currentIndex !== row.originalIndex) {
                    this.data.splice(currentIndex, 1); // Remove from top
                    this.data.splice(row.originalIndex, 0, row); // Insert back
                    // Optional: clean up metadata
                    //delete row.originalIndex;
                }
            }
        }

        this.evaluateGlobalChanges();
    }

    /**
     * V2 support the unshifting of updated record to the top of table
     * auto reverted when rollback
     * but some cases fails
     */
    markUnsavedV2(row: any, rowIndex: number): void {
        const originalRow = this.originalData[rowIndex];
        if (!originalRow) {
            row.unsaved = true;
            return;
        }
        let isChanged = false;
        // Compare each field
        for (const key of Object.keys(originalRow)) {
            if (typeof row[key] === 'object') {
                //isChanged = !JSON.stringify(row[key]).includes(JSON.stringify(originalRow[key])); //plan is text but in this.data is object
                isChanged = JSON.stringify(row[key])!==JSON.stringify(originalRow[key]); // when recive true data then compare objects
            } else {
                isChanged = row[key] !== originalRow[key];
            }
            if (isChanged){
                console.log("key is "+JSON.stringify(row[key]) + "and" + originalRow[key]); break;
            }
        }

        row.unsaved = isChanged;
        if (isChanged) {
            if (!this.changedRows.includes(row)) {
                // Save original index only once
                row.originalIndex = rowIndex;
                // Remove from current position and unshift to top
                this.data.splice(rowIndex, 1);
                this.data.unshift(row);
                this.originalData.splice(rowIndex, 1);
                this.originalData.unshift(originalRow);
                this.changedRows.push(row);
            }
        } else {
            // Reverted changes
            const indexInChanged = this.changedRows.indexOf(row);
            if (indexInChanged !== -1) {
                this.changedRows.splice(indexInChanged, 1);
            }
            row.unsaved = false;
            // Only move back if it was previously moved
            if (row.originalIndex !== undefined) {
                const currentIndex = this.data.indexOf(row);
                if (currentIndex !== row.originalIndex) {
                    this.data.splice(currentIndex, 1); // Remove from top
                    this.data.splice(row.originalIndex, 0, row); // Insert back
                    // Optional: clean up metadata
                    //delete row.originalIndex;
                }
            }
        }

        this.evaluateGlobalChanges();
    }

    evaluateGlobalChanges(): void {
        this.changesExists = this.changedRows.length>0;
    }

    showDialogSystemStatus(id,key) {
        this.modalEditable = false;
        this.modalData = this.data[id][key];
        this.modalConfig =  [
            { header: 'Status', field: 'status' },
            { header: 'Error', field: 'error' },
            { header: 'Date', field: 'date',"filterType": "timeline" },];
        setTimeout(() => this.displayModal = true, 0);
    }

    onDialogClose() {
        if (this.modalComponent?.emitData) {
            this.modalComponent.emitData(); // Call emit on close
        }
    }

    updateData(updatedItem: any) {
        updatedItem.unsaved = true; // Mark as not saved
        // updatedItem.actionType = ActionType.EDIT;
        // console.log("action is "+updatedItem.actionType);
        this.data.splice(this.detailsId, 1); // Remove fromadd( current position
        this.data.unshift(updatedItem); // Insert at the top
    }

    getDataForDetail():any{
        const dataRow=this.data[this.detailsId];
        dataRow.originalIndex=this.detailsId;
        return dataRow;
    }

    constructor(private customerService: CustomerService, private productService: ProductService,
                //private genericCustomer:GenericTable,
                private cd: ChangeDetectorRef,
                private confirmationService: ConfirmationService) {

    }

    ngOnInit() {

        if (this.data){
            //this.setData(this.data);
            this.loading = false;
        }
        //console.log("the original data is "+this.originalData);
        this.globalFilterFields = this.cols
            .filter(col => col.globalFilter === true)
            .map(col => col.field);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    confirmRemove() {
        if (this.selectedDataRow.length>0){
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${this.selectedDataRow.length} record(s)?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Confirm',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-outlined p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            accept: () => {
                this.onRemove();
            }
        });
        }
    }

    onRemove() {
        this.selectedDataRow.forEach(row=>row.actionType=ActionType.REMOVE);
        this.removedData.push(...this.selectedDataRow);
        this.data = this.data.filter(row => !this.selectedDataRow.includes(row));
        this.selectedDataRow = []; // Clear selection
        this.remove.emit({ type: 'delete', data: this.removedData });
        this.cd.detectChanges();
    }

    confirmSaveChanges() {
        const hasValidationErrors = this.selectedDataRow.some(row =>
            this.validationErrors[row.originalIndex] &&
            Object.keys(this.validationErrors[row.originalIndex]).length > 0
        );

        if (hasValidationErrors) {
            // Show alert-style dialog
            this.confirmationService.confirm({
                message: `Some selected rows contain validation errors. Please fix them before saving.`,
                header: 'Invalid Selected Rows',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'OK',
                rejectVisible: false, // Hide Cancel button
                acceptButtonStyleClass: 'p-button-sm p-button-danger',
                accept: () => {} // Do nothing on OK
            });
            return;
        }

        if (this.selectedDataRow.length > 0) {
            this.confirmationService.confirm({
                message: `You are about to save <strong>${this.selectedDataRow.length}</strong> modified record(s). This action will apply all changes permanently. Do you want to continue?`,
                header: 'Confirm Save Changes',
                icon: 'pi pi-save',
                acceptLabel: 'Yes, Save',
                rejectLabel: 'Cancel',
                acceptButtonStyleClass: 'p-button-sm p-button-success',
                rejectButtonStyleClass: 'p-button-sm p-button-secondary',
                accept: () => {
                    this.saveChanges();
                }
            });
        }
    }


    saveChanges() {
        this.selectedDataRow.forEach(updatedRow => {
            updatedRow.unsaved = false;
            updatedRow.selected = false;
            const index = this.data.findIndex(row => row.id === updatedRow.id); // Match by unique key
            if (index !== -1) {
                this.originalData[index] = { ...updatedRow };
            }
        });

        const selectedIds = this.selectedDataRow.map(row => row.id);
        this.changedRows = this.changedRows.filter(row => !selectedIds.includes(row.id));
        this.save.emit({ type: 'edit', data: this.selectedDataRow});
        this.selectedDataRow = [];
        this.cd.detectChanges();
    }
    // Method to handle row selection
    onRowSelect(rowData: any,index:number) {
        if (rowData.selected) {
            // Add to selectedDataRow when checked
            if (!this.selectedDataRow.includes(rowData)) {
                this.selectedDataRow.push(rowData);
            }
        } else {
            // Remove using ID instead of reference
            this.selectedDataRow = this.selectedDataRow.filter(row => row.id !== rowData.id);
        }
        console.log("lengh : "+this.selectedDataRow.length);
    }

    selectAll() {
        if (this.isAllSelected) {
            this.selectedDataRow = [...this.data];
            this.data.forEach(row => row.selected = true);
        } else {
            this.selectedDataRow = [];
            this.data.forEach(row => row.selected = false);
        }
    }
    add(){
        if (!this.data || this.data.length === 0) {
            console.warn("No reference data structure available.");
            return;
        }

        const baseItem = this.data[0];
        const newItem = Object.keys(baseItem).reduce((obj, key) => {
            obj[key] = null;
            return obj;
        }, {} as any);

        newItem.unsaved = true;
        this.changesExists=true;
        newItem.actionType=ActionType.ADD;
        newItem.originalIndex=0;
        // newItem.actionType = ActionType.ADD;
        // console.log("action is "+newItem.actionType);
        this.data = [newItem, ...this.data];
        this.cd.detectChanges();
        //alert("the data legth : "+this.data.length);
    }

}
