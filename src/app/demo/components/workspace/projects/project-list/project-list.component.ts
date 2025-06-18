import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
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
    projects: Project[] = [];


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
        private router: Router,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        // this.projectService.getProjects().then(projects => {
        //     this.projects = projects
        //     this.loading = false;
        //
        //     // @ts-ignore
        //     this.projects.forEach(project =>{
        //         project.startDate = new Date(project.startDate),
        //         project.endDate = new Date(project.endDate),
        //         project.deliveryDate = new Date(project.deliveryDate)
        //     });
        // });

        this.authService.currentUser$.pipe(
            filter(user => !!user),
            switchMap(user => {
                this.loading = true;
                return this.projectService.getAllProjectsByPM(user!.id);
            })
        ).subscribe(projects => {
            this.projects = projects.map(project => ({
                ...project,
                startDate: project.startDate ? new Date(project.startDate) : null,
                endDate: project.endDate ? new Date(project.endDate) : null,
                deliveryDate: project.deliveryDate ? new Date(project.deliveryDate) : null
            }));
            projects.map(p =>console.log("start date du projet :" +p.startDate));
            //this.projects = projects;
            this.loading = false;

        });

        this.projectStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Closed', value: 'closed' },
        ];
        this.phaseStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come', id: 1 },
            { label: 'In progress', value: 'in_progress', id: 2 },
            { label: 'Pending Validation', value: 'pending_validation', id: 3 },
            { label: 'Completed', value: 'completed', id: 4 },
        ];
        this.phases = [ //utiliser toLowerCase pour les valeurs
            { label: 'Study', value: 'study', id: 1 },
            { label: 'Workload Estimation', value: 'workload_estimation', id: 2 },
            { label: 'Development', value: 'development', id: 3 },
            { label: 'Unit Testing', value: 'unit_testing', id: 4 },
            { label: 'Testing With Client', value: 'testing_with_client', id: 5 },
            { label: 'Production Deployment', value: 'production_deployment', id: 6 },
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
        return project.tasks?.filter((t: any) => t.status.name.toUpperCase() === 'COMPLETED').length || 0;
    }

    getOpenTasksCount(project: any): number {
        return project.tasks?.filter((t: any) => t.status.name.toUpperCase() !== 'COMPLETED').length || 0;
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

        // if (this.useDuration && this.project.startDate && this.project.estimatedWorkDays) {
        //     // Si on passe en mode "Enter Duration" et que la startDate et estimatedWorkDays sont renseignés
        //     const startDate = new Date(this.project.startDate);
        //     startDate.setDate(startDate.getDate() + this.project.estimatedWorkDays); // Calculer endDate
        //     this.project.endDate = startDate;
        // }
        //
        // if (!this.useDuration && this.project.startDate && this.project.endDate) {
        //     // Si on passe en mode "Enter Date", recalculer estimatedWorkDays
        //     const startDate = new Date(this.project.startDate);
        //     const endDate = new Date(this.project.endDate);
        //     const timeDiff = endDate.getTime() - startDate.getTime();
        //     const dayDiff = timeDiff / (1000 * 3600 * 24); // Convertir en jours
        //     this.project.estimatedWorkDays = dayDiff;
        // }

        if(this.useDuration){
            this.project.endDate = null;
        }else {
            this.project.estimatedWorkDays = null;
        }
    }
    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }

    formatDateToMMDDYYYY(date: any): string | null {
        if (!date || isNaN(new Date(date).getTime())) return null;

        const d = new Date(date);
        const day = `${d.getDate()}`.padStart(2, '0');
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const year = d.getFullYear();

        return `${month}/${day}/${year}`;
    }

    saveProject() {
        this.submitted = true;

        // Validation simple
        if (!this.project.name) {
            return;
        }

        if (this.useDuration) {
            // Si l'utilisateur a choisi de saisir la durée (estimatedWorkDays), calculer endDate
            if (this.project.estimatedWorkDays && this.project.startDate) {
                const startDate = new Date(this.project.startDate);
                startDate.setDate(startDate.getDate() + this.project.estimatedWorkDays); // Ajouter la durée à la startDate
                this.project.endDate = startDate ;
            }
        } else {
            // Si l'utilisateur a choisi de saisir les dates (startDate, endDate), calculer estimatedWorkDays
            if (this.project.startDate && this.project.endDate) {
                const startDate = new Date(this.project.startDate);
                const endDate = new Date(this.project.endDate);
                const timeDiff = endDate.getTime() - startDate.getTime();
                const dayDiff = timeDiff / (1000 * 3600 * 24); // Convertir la différence en jours
                this.project.estimatedWorkDays = dayDiff;
            }
        }

        let progress = 0;
        // if (this.project.startDate && this.project.estimatedWorkDays) {
        //     const start = new Date(this.project.startDate).getTime();
        //     const now = new Date().getTime();
        //     const daysPassed = Math.floor((now - start) / (1000 * 3600 * 24)); // jours écoulés
        //     if (this.project.estimatedWorkDays > 0) {
        //         progress = Math.round((daysPassed / this.project.estimatedWorkDays) * 100);
        //     }
        // }

        if (this.project.actualWorkDays != null && this.project.estimatedWorkDays && this.project.estimatedWorkDays > 0) {
            progress = Math.round((this.project.actualWorkDays / this.project.estimatedWorkDays) * 100);
        }

        // Construire le corps de la requête
        const newProjectPayload = {
            name: this.project.name,
            description: this.project.description,
            status: this.project.status?.toUpperCase(),
            startDate: this.formatDateToMMDDYYYY(this.project.startDate),
            endDate: this.formatDateToMMDDYYYY(this.project.endDate),
            deliveryDate: this.formatDateToMMDDYYYY(this.project.deliveryDate),
            actualWorkDays: this.project.actualWorkDays,
            estimatedWorkDays: this.project.estimatedWorkDays,
            progress: progress,
            clientId: this.project.clientId,
            projectManagerId: this.authService.getCurrentUserId(), // à adapter selon ta logique
            phase: {
                id: this.phases.find(p => p.value === this.project.phase?.name)?.id || 3, // fallback si besoin
                // status: {
                //     id: this.phaseStatuses.find(ps => ps.value === this.project.phase?.status?.name)?.id || 3
                // }
            },
            statusPhase: {
                id: this.phaseStatuses.find(ps => ps.value === this.project.statusPhase?.name)?.id || 3
            }
        };

        if(this.project.id){
            // -- UPDATE --
            this.projectService.updateProject(this.project.id, newProjectPayload).subscribe({
                next: (updatedProject) => {
                    console.log("newProjectPayload: ")
                    console.log(newProjectPayload)

                    console.log("updatedProject: ")
                    console.log(updatedProject)
                    const index = this.projects.findIndex(p => p.id === updatedProject.id);
                    if (index !== -1) {
                        updatedProject.startDate = updatedProject.startDate ? new Date(updatedProject.startDate) : null;
                        updatedProject.endDate = updatedProject.endDate ? new Date(updatedProject.endDate) : null;
                        updatedProject.deliveryDate = updatedProject.deliveryDate ? new Date(updatedProject.deliveryDate) : null;
                        this.projects[index] = updatedProject;
                        this.projects = [...this.projects];
                    }
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Updated', life: 3000 });
                    this.projectDialog = false;
                    this.project = {};
                    this.submitted = false;
                },
                error: err => {
                    console.log("newProjectPayload: ")
                    console.log(newProjectPayload)
                    const detail = err.error?.message ?? 'Project not updated.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail, life: 3000 });
                    console.error(err);

                }
            });
        }else {
            // -- CREATE --
            this.projectService.createProject(newProjectPayload).subscribe({
                next: (createdProject) => {
                    //formter les dates pour les filtrages
                    createdProject.startDate = new Date(createdProject.startDate),
                    createdProject.endDate = new Date(createdProject.endDate),
                    createdProject.deliveryDate = new Date(createdProject.deliveryDate)

                    this.projects.push(createdProject);
                    this.projectDialog = false;
                    this.project = {};
                    this.submitted = false;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Created', life: 3000 });

                },
                error: err => {
                    console.error("Project not created.", err);
                    const detail = err.error?.message ??  'Project not created.';
                    this.messageService.add({
                        severity: 'error',
                        summary: err.status === 409 ? 'Conflict' : 'Error',
                        detail: detail,
                        life: 3000
                    });
                    console.log(newProjectPayload);
                }
            });
        }

    }

    editProject(project: Project) {
        console.log("project to edit: ")
        console.log(project)
        this.project = {
            ...project,
            status: project.status.toLowerCase(),
            phase: {
                name: project.phase?.name.toLowerCase(),
                // status: {
                //     name: project.phase?.status?.name.toLowerCase()
                // }
            },
            statusPhase: {
                name: project.statusPhase?.name.toLowerCase()
            }
        };
        this.useDuration = false; // ou adapter selon l'état du projet
        this.projectDialog = true;
        this.submitted = false;
    }

    trashProject(project: Project){

    }
    openNewPoject() {
        this.projectDialog = true;
        this.project = {
            status: 'to_come',
            phase: {
                name: 'study',
                //phaseStatus: 'to_come',
                // status: {
                //     name: 'to_come'
                // }
            },
            statusPhase: {
                name: 'to_come'
            }
        };
        this.submitted = false;
    }
}
