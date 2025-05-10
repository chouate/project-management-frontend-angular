import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
  import { ButtonModule } from 'primeng/button';
  import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges,OnInit {
@Input() data:any;
    @Input() config:any[];
    @Input() editable:boolean=false;
    @Input() originalIndex:number;
    rowData: any[] = [];
    @Output() save: EventEmitter<any> = new EventEmitter();
    @Input() tabToEditSwitch:boolean=true;
    constructor(){}
    ngOnInit() {
        this.rowData = this.config.map(col => ({
            field: col.field,
            header: col.header,
            value: this.data[col.field],
            filterType: col.filterType,
            options: col.options || [],
            optionLabel:col.optionLabel,
            optionValue:col.optionValue,
            editable:col.editable,
        }));
    }

    isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    emitData() {
        if (this.editable) {
            const updatedData: any = {};
            this.rowData.forEach(row => {
                updatedData[row.field] = row.value;
            });
            const isChanged = Object.keys(updatedData).some(key => updatedData[key] !== this.data[key]);
            if (isChanged) {
                this.data = updatedData;
                this.data.originalIndex=this.originalIndex;
                this.save.emit(updatedData);
            }
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            console.log('Modal data changed:', this.data);  // This will log whenever the input data changes

            // Update rowData every time data changes
            this.rowData = this.config.map(col => ({
                field: col.field,
                header: col.header,
                value: this.data[col.field],
                filterType: col.filterType,
                options: col.options || [],
                optionLabel: col.optionLabel,
                optionValue: col.optionValue,
                editable:col.editable,
            }));
        }
    }

    getMultiSelectLabels(values: any[], optionLabel: string): string {
        if (!values || !Array.isArray(values)) return '';
        return values.map(val => this.isObject(val) ? val[optionLabel] : val).join(', ');
    }
}
