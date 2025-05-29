import {Component, OnInit} from '@angular/core';
import {
    AbstractSearchComponent,
    DataNotFoundException
} from "../../../shared-demo/abstract-search/abstract-search.component";

interface Client {
    name: string;
    code: string;
    activityDomain: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    startDate: string;
    endDateEstimate: string;
}

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})

export class ClientsListComponent extends AbstractSearchComponent implements OnInit {
    data: any[] = [];
    originalData: any[] = [];
    cols: any[] = [];

    ngOnInit() {
        this.cols = [
            {
                "header": "Name",
                "field": "name",
                "filterType": "text",
                //"options": planReferences,
                //"optionLabel": "reference",
                "globalFilter": true,
                "principal": true,
                //"pk":true
            },
            {
                "header": "Code",
                "field": "code",
                "filterType": "text",
                "globalFilter": true,
                "principal": true,
            },
            {
                "header": "Activity Domain",
                "field": "activityDomaine",
                "filterType": "text",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Contact Name",
                "field": "contactName",
                "filterType": "text",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Contact Email",
                "field": "contactEmail",
                "filterType": "text",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Contact Phone Number",
                "field": "contactPhone",
                "filterType": "text",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Start Date",
                "field": "startDate",
                "filterType": "timeline",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "End Date Estimate",
                "field": "endDateEstimate",
                "filterType": "timeline",
                //"currency": "USD",
                "globalFilter": true,
                "principal": true,

            },
            {
                "header": "Deatils",
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
        this.data=[

            {
                id: 1,
                name: 'ABC Industries',
                code: 'ABC001',
                activityDomaine: 'Manufacture',
                contactName: 'Karim El Fassi',
                contactEmail: 'karim.fassi@abc.com',
                contactPhone: '+212600112233',
                startDate: '2024-01-15',
                endDateEstimate: '2025-01-15'
            },
            {
                id: 2,
                name: 'TechCo SARL',
                code: 'TECH02',
                activityDomaine: 'IT Services',
                contactName: 'Sara Benali',
                contactEmail: 'sara.benali@techco.ma',
                contactPhone: '+212600223344',
                startDate: '2023-06-01',
                endDateEstimate: '2024-06-01'
            },
        ]

        //this.search();

        // Deep-clone pour originalData
        this.originalData = this.data.map(d => ({ ...d }));
    }

    search(){
        const BOUQUET_SEARCH = {
            service: "clients/getAll"
        };
        this.postFetch({}, BOUQUET_SEARCH, (result) => {
            this.searchClientsCallback(result);
        });
    }
    searchClientsCallback(result) {
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

