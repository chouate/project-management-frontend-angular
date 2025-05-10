import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {Table} from "primeng/table";
import {Client} from "../../../../api/client";
import {ClientService} from "../../../../service/client.service";
import {color} from "chart.js/helpers";
import {forkJoin, Observable, of, reduce} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-clients-list-v2',
  templateUrl: './clients-list-v2.component.html',
  styleUrls: ['./clients-list-v2.component.scss'],
  providers: [MessageService]
})
export class ClientsListV2Component implements OnInit{
    clientDialog: boolean = false;

    deleteClientDialog: boolean = false;

    deleteClientsDialog: boolean = false;

    clients: Client[] = [];

    client: Client = {};

    codeError: string | null = null;

    fieldErrors: {[field: string]: string} = {};

    selectedClients: Client[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    projectManagers: { label: string, value: number }[] = [];

    listProjectManagers: Observable<any[]> ;

    rowsPerPageOptions = [5, 10, 20];

    constructor(
              private clientService: ClientService,
              private messageService: MessageService
    ) { }

    ngOnInit() {

        // this.clientService.getClients().then(data => this.clients = data);

        this.clientService.getClients().subscribe({
          next: clients => {
              this.clients = clients;
              console.log('Clients reçus:', this.clients);
          },
          error: err => console.error('Erreur chargement clients', err)
        });

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Name' },
            { field: 'code', header: 'Code' },
            { field: 'activityDomain', header: 'Activity Domain' },
            { field: 'contactName', header: 'Contact Name' },
            { field: 'contactEmail', header: 'Email' },
            { field: 'contactPhoneNumber', header: 'Contact Phone Number' },
            { field: 'startDate', header: 'Start Date' },
            { field: 'endDateEstimate', header: 'End Date Estimate' },
            { field: 'projectManager.?id', header: 'Project Manager' },
            { field: 'details', header: 'Details' },
            { field: 'response', header: 'Response' },

        ];

        const mockPMs = [
          {id: 1, firstName: 'Adnane', lastName: 'Tanan', email: '<EMAIL>'},
          {id: 2, firstName: 'Taha', lastName: 'Daoui', email: '<EMAIL>'},
          {id: 3, firstName: 'Mehdi', lastName: 'El Majdoub', email: '<EMAIL>'},
          {id: 4, firstName: 'Nada', lastName: 'Ettouhami', email: '<EMAIL>'},
          {id: 5, firstName: 'Yassine', lastName: 'Benani', email: '<EMAIL>'},
          {id: 6, firstName: 'Ahmed', lastName: 'Benmahmoud', email: '<EMAIL>'},
          {id: 7, firstName: 'Youness', lastName: 'Ezeouine', email: '<EMAIL>'},
          {id: 8, firstName: 'Jamila', lastName: 'Touhami', email: '<EMAIL>'},
        ]
        this.listProjectManagers= of(mockPMs);

        this.listProjectManagers.subscribe(listPM =>{
            this.projectManagers = listPM.map(pm => ({label: pm.firstName + ' ' + pm.lastName, value: pm.id}));
        });

    }

    openNew() {
        this.client = {};
        this.submitted = false;
        this.clientDialog = true;
        this.codeError = null; // ← Réinitialiser l’erreur au démarrage
        this.fieldErrors = null
    }

    deleteSelectedClients() {
        this.deleteClientsDialog = true;
    }

    editClient(client: Client) {
        this.client = { ...client };
        this.clientDialog = true;
        this.codeError = null;
        this.fieldErrors = null
    }

    deleteClient(client: Client) {
        this.deleteClientDialog = true;
        this.client = { ...client };
    }

    confirmDeleteSelected() {
        this.deleteClientsDialog = false;

        const idsToDelete = this.selectedClients
          .map(c => c.id)
          .filter((id): id is number => id != null);

        // Appel parallel via fokJoin
        forkJoin(idsToDelete.map(id => this.clientService.deleteClient(id)))
          .subscribe({
              next: () => {
                  console.log("la liste des clients est bien supprimée")
                  this.clients = this.clients.filter(c => !idsToDelete.includes(c.id));
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
                  this.selectedClients = [];
              },
              error: err => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Impossible to delete selected clients',
                      life: 3000
                  });
                  console.error(err);
              }
          })
    }

    confirmDelete() {
        this.deleteClientDialog = false;

        if(!this.client.id){
          return;
        }

        this.clientService.deleteClient(this.client.id).subscribe({
          next: () => {
              console.log("the client is deleted with id : " + this.client.id);
              this.clients = this.clients.filter(c => c.id !== this.client.id);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
              this.client = {};
          },
          error: err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Client not deleted', life: 3000 });
              console.error(err);
          }
        })
    }

    hideDialog() {
        this.clientDialog = false;
        this.submitted = false;
    }

    saveClient(){
        this.submitted = true;
        this.codeError = null // ← On efface toute ancienne erreur
        this.fieldErrors = null

        if(!this.client.name?.trim()){
          return;
        }

        if ((this.client as any).projectManager?.value) {
          this.client.projectManagerId = (this.client as any).projectManagerId.value;
        }

        if(this.client.id){
            // update in database
            console.log("client a modifier : ", this.client);
            this.clientService.updateClient(this.client).subscribe({
                next: updated => {
                    // on rafraîchit l’UI avec l’objet renvoyé
                    const idx = this.clients.findIndex(c => c.id === updated.id);
                    if(idx > -1){
                        this.clients[idx] = updated;
                        this.clients = [...this.clients];
                    }
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
                    this.onDialogClose();
                },
                error: (err: HttpErrorResponse) => {
                    const message = err.error?.message ?? 'Client not updated.';
                    const summary = err.status === 409 ? 'Conflict' : 'Error';
                    // Si 400, on récupère le body (un objet champ→message)
                    if (err.status === 400 && typeof err.error === 'object') {
                        this.fieldErrors = { ...err.error };
                    }
                    if(err.status === 409 ){
                        this.codeError = message;
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: summary,
                        detail: message,
                        life: 3000
                    });
                    console.error(err);
                }
            });
        }else {
          //create in database
          console.log("client a creer : ", this.client);
          this.clientService.createClient(this.client).subscribe({
              next: created => {
                  this.clients.push(created);
                  this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
                  this.onDialogClose();
              },
              error: (err: HttpErrorResponse) => {
                  const detail = err.error?.message ??  'Client not created.';
                  // Si 400, on récupère le body (un objet champ→message)
                  if (err.status === 400 && typeof err.error === 'object') {
                      this.fieldErrors = { ...err.error };
                  }
                  // Si 409 Conflit,
                  if (err.status === 409 ) {
                      this.codeError = detail
                  }
                  this.messageService.add({
                      severity: 'error',
                      summary: err.status === 409 ? 'Conflict' : 'Error',
                      detail: detail,
                      life: 3000
                  });
                  console.error(err);
              }
          });
        }
    }

    private onDialogClose(){
        this.clientDialog = false;
        this.client = {};
        this.submitted = false;
        this.codeError= null // ← Réinitialiser à la fermeture aussi
        this.fieldErrors = null
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    isNumberKey(event: KeyboardEvent): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
            return false;
        }
        return true;
    }


    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


    protected readonly color = color;
    protected readonly reduce = reduce;
}
