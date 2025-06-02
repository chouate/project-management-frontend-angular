import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {Customer, Representative} from "../../../../api/customer";
import {Product} from "../../../../api/product";
import {CustomerService} from "../../../../service/customer.service";
import {ProductService} from "../../../../service/product.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProjectService} from "../../../../service/project.service";
import {Project} from "../../../../api/Project";
import {Router} from "@angular/router";
import {filter,switchMap} from "rxjs";
import {AuthService} from "../../../../service/auth.service";
import {ClientService} from "../../../../service/client.service";

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
    providers: [MessageService, ConfirmationService]
})

export class ProjectListComponent implements OnInit {
    customers1: Customer[] = [];
    projects: Project[] = [];


    statuses: any[] = [];
    projectStatuses: any[] = [];
    phaseStatuses: any[] = [];
    phases: any[] = [];

    //attributes for project dialog
    projectDialog: boolean = false;
    submitted: boolean = false;
    project: Project = {};
    useDuration: boolean = false;
    clientsAffected: { label:string, value: number }[] = [];

    activityValues: number[] = [0, 100];
    progressValues: number[] = [0, 100];

    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;

    multipleSelectionSwitch: boolean = true;

    selectedDataRow: any[] = []; // Store selected rows

    constructor(
        private customerService: CustomerService,
        private projectService: ProjectService,
        private authService: AuthService,
        private clientService: ClientService,
        private router: Router
    ) { }

    ngOnInit() {
        this.projectService.getProjects().then(projects => {
            this.customers1 = projects;
            this.projects = projects
            this.loading = false;

            // @ts-ignore
            this.customers1.forEach(project => project.date = new Date(project.date));
            // @ts-ignore
            this.projects.forEach(project =>{
                project.startDate = new Date(project.startDate),
                project.endDate = new Date(project.endDate),
                project.deliveryDate = new Date(project.deliveryDate)
            });
        });

        this.projectStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Closed', value: 'closed' },
        ];
        this.phaseStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Pending Validation', value: 'pending_validation' },
            { label: 'Completed', value: 'completed' },
        ];
        this.phases = [ //utiliser toLowerCase pour les valeurs
            { label: 'Study', value: 'study' },
            { label: 'Workload Estimation', value: 'workload_estimation' },
            { label: 'Development', value: 'development' },
            { label: 'Unit Testing', value: 'unit_testing' },
            { label: 'Testing With Client', value: 'testing_with_client' },
            { label: 'Production Deployment', value: 'production_deployment' },
        ]


        this.authService.currentUser$.pipe(
            filter(u => !!u),
            switchMap(user  =>
                // @ts-ignore
                this.clientService.getClientsByPM(user.id)

            )
        ).subscribe(clients => {
            this.clientsAffected = clients.map(c => ({
                label: `${c.name}: (code: ${c.code})`,
                value: c.id
            }));
            console.log("clientsAffected: ")
            console.log(this.clientsAffected);
        });
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';

    }

    getClosedTasksCount(project: any): number {
        return project.tasks?.filter((t: any) => t.status.toUpperCase() === 'COMPLETED').length || 0;
    }

    getOpenTasksCount(project: any): number {
        return project.tasks?.filter((t: any) => t.status.toUpperCase() !== 'COMPLETED').length || 0;
    }

    getTaskProgress(project: any): number {
        const total = project.tasks?.length || 0;
        const closed = this.getClosedTasksCount(project);
        return total === 0 ? 0 : Math.round((closed / total) * 100);
    }

    accessProject(project: any) {
        // Ajoutez ici la logique pour accéder au projet
        console.log('Accessing project:', project);
        this.router.navigate(['/projects', project.id]);

    }

    add() {

    }

    confirmRemove() {

    }
    toggleDuration(value: boolean, event: Event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        this.useDuration = value;
    }
    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }

    saveProject(){

    }

    openNewPoject() {
        this.projectDialog = true;
        this.project = {
            status: 'to_come',
            phase: {
                name: 'study',
                phaseStatus: 'to_come'
            }
        };
        this.submitted = false;
    }
}
