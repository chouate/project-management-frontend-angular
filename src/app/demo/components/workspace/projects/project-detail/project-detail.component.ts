import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Project} from "../../../../api/Project";
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../../../service/project.service";
import {Table} from "primeng/table";
import {HttpErrorResponse} from "@angular/common/http";
import {Task} from "../../../../api/Task";
import {filter, switchMap} from "rxjs";
import {AuthService} from "../../../../service/auth.service";
import {UserService} from "../../../../service/user.service";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit{
    project: Project;
    items: MenuItem[];
    activeItem: MenuItem;

    taskStatuses: any[] = [];

    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;

    multipleSelectionSwitch: boolean = true;

    taskDialog: boolean = false;
    submitted: boolean = false;

    task: Task = {};
    owners: { label: string, value: number }[] = [];

    useDuration: boolean = false;


    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        // Récupérer l'ID du projet depuis l'URL
        const projectId:number = Number(this.route.snapshot.params['id']);

        // Charger les détails du projet
        this.projectService.getProjectById(projectId).then(project => {
            this.project = project;
            console.log(projectId);
            console.log("project detail");
            console.log(this.project);
        });

        // Configuration du TabMenu
        this.items = [
            { label: 'Dashboard', icon: 'pi pi-chart-bar' },
            { label: 'Tasks', icon: 'pi pi-list' },
            { label: 'Documents', icon: 'pi pi-file' }
        ];

        this.activeItem = this.items[1];


        this.taskStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Closed', value: 'completed' },
        ];

        this.authService.currentUser$.pipe(
            filter(u => !!u),
            switchMap(user  =>
                this.userService.getCollabrators()

            )
        ).subscribe(pms => {
            this.owners = pms.map(pm => ({
                label: `${pm.firstName} ${pm.lastName}`,
                value: pm.id
            }));
            console.log("owners: ")
            console.log(this.owners);
        });
    }

    onTabChange(item: MenuItem) {
        this.activeItem = item;
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';

    }

    openNewTask() {
        this.taskDialog = true;
        this.task = {
            status: 'to_come',
        };
        this.submitted = false;
    }

    confirmRemove() {

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    accessTask(task: any) {
        // Ajoutez ici la logique pour accéder au projet
        console.log('Accessing task:', task);
        this.router.navigate(['/tasks', task.id]);

    }

    getActualWorkDaysCount(task: any): number {
        return task.actualWorkDays;
    }

    getDaysRemaining(task: any): number {
        return task.estimatedWorkDays - task.actualWorkDays;
    }

    onImageError(event: any) {
        event.target.src = 'assets/demo/images/user/userDefault.png';
    }

    hideDialog() {
        this.taskDialog = false;
        this.submitted = false;
    }

    saveTask(){

    }

    toggleDuration(value: boolean, event: Event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        this.useDuration = value;
    }
}
