import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Technology } from '../../../../api/technology';
import {TechnologyService} from "../../../../service/technology.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {Table} from "primeng/table";
import {forkJoin} from "rxjs";

@Component({
    selector: 'app-technology-list',
    templateUrl: './technology-list.component.html',
    styleUrls: ['./technology-list.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class TechnologyListComponent implements OnInit{
    technologies: Technology[] = [];
    technologyDialog: boolean = false;
    technology: Technology = {};
    submitted: boolean = false;
    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;

    deleteTechnologyDialog: boolean = false;
    deleteTechnologiesDialog: boolean = false;
    selectedTechnologies: Technology[] = [];

    constructor(
        private technologyService: TechnologyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.technologyService.getTechnologies().subscribe(techs => {
            this.technologies = techs;
            this.loading = false;
        });
    }

    openNewTechnology(): void {
        this.technology = {};
        this.submitted = false;
        this.technologyDialog = true;
    }

    editTechnology(tech: Technology): void {
        this.technology = { ...tech };
        this.technologyDialog = true;
    }

    deleteTechnology(tech: Technology): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${tech.name}"?`,
            accept: () => {
                this.technologyService.deleteTechnology(tech.id!).subscribe(() => {
                    this.technologies = this.technologies.filter(t => t.id !== tech.id);
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Technology removed' });
                });
            }
        });
    }

    saveTechnology() {
        this.submitted = true;

        if (!this.technology.name){
            return;
        }

        if (this.technology.id) {
            this.technologyService.updateTechnology(this.technology).subscribe(updated => {
                const index = this.technologies.findIndex(t => t.id === updated.id);
                this.technologies[index] = updated;
                this.technologies = [...this.technologies];
                this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Technology updated' });
                this.technologyDialog = false;
                this.technology = {};
            });
        } else {
            this.technologyService.createTechnology(this.technology).subscribe(created => {
                this.technologies.push(created);
                this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Technology created' });
                this.technologyDialog = false;
                this.technology = {};
            });
        }

    }

    hideDialog(): void {
        this.technologyDialog = false;
        this.submitted = false;
    }

    clear(table: Table): void {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // Fonction pour ouvrir la suppression simple
    confirmDeleteTechnology(technology: Technology) {
        this.technology = { ...technology };
        this.deleteTechnologyDialog = true;
    }

// Suppression simple confirmée
    confirmDelete() {
        this.deleteTechnologyDialog = false;
        if (!this.technology.id) return;

        this.technologyService.deleteTechnology(this.technology.id).subscribe({
            next: () => {
                this.technologies = this.technologies.filter(t => t.id !== this.technology.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technology Deleted', life: 3000 });
                this.technology = {};
            },
            error: err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Technology not deleted', life: 3000 });
                console.error(err);
            }
        });
    }

    // Suppression multiple
    confirmDeleteSelected() {
        this.deleteTechnologiesDialog = false;
        const idsToDelete = this.selectedTechnologies.map(t => t.id).filter((id): id is number => id != null);

        forkJoin(idsToDelete.map(id => this.technologyService.deleteTechnology(id))).subscribe({
            next: () => {
                this.technologies = this.technologies.filter(t => !idsToDelete.includes(t.id));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technologies Deleted', life: 3000 });
                this.selectedTechnologies = [];
            },
            error: err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete selected technologies', life: 3000 });
                console.error(err);
            }
        });
    }
}
