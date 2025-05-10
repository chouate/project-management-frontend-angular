import {Component, OnInit} from '@angular/core';
import {AbstractSearchComponent, DataNotFoundException} from "../abstract-search/abstract-search.component";
//import {AbstractSearchComponent, DataNotFoundException} from "../../shared/components/abstract-search/abstract-search.component";

@Component({
  selector: 'app-plans-management',
  templateUrl: './plans-management.component.html',
  styleUrls: ['./plans-management.component.scss']
})
export class PlansManagementComponent extends AbstractSearchComponent implements OnInit {
    data: any[] = [];
    originalData: any[] = [];
    cols: any[] = [];

    ngOnInit() {
        const planReferences=[
            { "reference": "REFERENCE_1", "duration": 0, "maxConnections": 0 },
            { "reference": "REFERENCE_2", "duration": 0, "maxConnections": 0 },
            { "reference": "REFERENCE_3", "duration": 30, "maxConnections": 1 },
        ]
        this.cols = [
            {
                "header": "Public reference",
                "field": "refPub",
                "filterType": "dropdown",
                "options": planReferences,
                "optionLabel": "reference",
                "globalFilter": true,
                "principal": true,
                "pk":true
            },
            // {
            //     "header": "Public reference",
            //     "field": "refPub",
            //     "filterType": "multi-select",
            //     "options": planReferences,
            //     "optionLabel": "reference",
            //     "globalFilter": true,
            //     "principal": true,
            //     "pk":true
            // },
            {
                "header": "Name",
                "field": "name",
                "filterType": "text",
                "globalFilter": true,
                "principal": true,
            },
            {
                "header": "Private price",
                "field": "priceProvider",
                "filterType": "amount",
                "currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Public price",
                "field": "pricePub",
                "filterType": "amount",
                "currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Discount",
                "field": "discount",
                "filterType": "number",
                "currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            // {
            //     "header": "Status",
            //     "field": "disabled",
            //     "filterType": "dropdown",
            //     "options": [{"label": "Disabled", "value": "Y"}, {"label": "Enabled", "value": "N"}],
            //     "optionLabel": "label",
            //     "optionValue": "value",
            //     "globalFilter": true,
            //     "principal": true,
            // },
            {
                "header": "Details",
                "field": "details",
                "filterType": "modal",
                "editable": false,
                "principal": true,

            },
            {
                "header": "Response",
                "field": "response",
                "filterType": "systemStatus",
                "options": [{"label": "Verified", "value": "Active"}, {"label": "Not Verified", "value": "Inactive"}],
                "editable": false,
                "principal": true,

            }
        ];
        // this.data=[
        //     {
        //         "refPub": "REFERENCE_1",
        //         "name": "Annual Plan - 3 Users",
        //         "priceProvider": 199.99,
        //         "pricePub": 249.99,
        //         "discount": 20,
        //         "disabled": "N"
        //     },
        //     {
        //         "refPub": "REFERENCE_2",
        //         "name": "Quarterly Plan - Single User",
        //         "priceProvider": 49.99,
        //         "pricePub": 59.99,
        //         "discount": 15,
        //         "disabled": "Y"
        //     }
        // ]

        //this.search();

        // // 2) Injectez manuellement un petit jeu de données :
        // // const planReferences = [
        // //     { reference: 'REF_1', duration: 0, maxConnections: 0 },
        // //     { reference: 'REF_2', duration: 30, maxConnections: 1 },
        // // ];
        this.data = planReferences.map(p => ({
            refPub:      p.reference,
            name:        `Plan ${p.reference}`,
            priceProvider: 100 + Math.random() * 100,
            pricePub:      120 + Math.random() * 100,
            discount:      10,
            details:       null,
            response:     Math.random() > 0.5
        }));
        // Deep-clone pour originalData
        this.originalData = this.data.map(d => ({ ...d }));
    }
    search(){
        const BOUQUET_SEARCH = {
            service: "plans/getAll"
        };
        this.postFetch({}, BOUQUET_SEARCH, (result) => {
            this.searchPlansCallback(result);
        });
    }
    searchPlansCallback(result) {
        if (result && !result['error']) {
            this.data=result;
            this.originalData=result.map(item => ({ ...item }));
            this.showSuccess();
        }else {
            console.error("No channels found.");
            this.showError(result['error']);
            throw new DataNotFoundException("PlanEntity");
        }
    }
    save(event: { type: string, data?: any }){
        const BOUQUET_SEARCH = {
            service: "plans/save-or-update/batch"
        };
        this.postFetch(JSON.stringify(event.data), BOUQUET_SEARCH, (result) => {
                this.saveChangesCallback(result);
            });
    }
    saveChangesCallback(result) {
        if (result && !result['error']) {
            this.showSuccess();
        }else {
            console.error("No channels found.");
            this.showError(result['error']);
            throw new DataNotFoundException("PlanEntity");
        }
    }
    remove(event: { type: string, data?: any }){
        const BOUQUET_SEARCH = {
            service: `plans/batch`,
            params: event.data.map(row => row.refPub)
        };
        this.deleteFetch( BOUQUET_SEARCH, (result) => {
                this.removeSelectedCallback(result);
            });
    }
    removeSelectedCallback(result) {
        if (result && !result['error']) {
            this.showSuccess();
        }else {
            console.error("No channels found.");
            this.showError(result['error']);
            throw new DataNotFoundException("PlanEntity");
        }
    }

}

