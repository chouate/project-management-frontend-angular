import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import {Project} from "../../../../api/Project";
import {MenuItem, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../../../service/project.service";
import {Table} from "primeng/table";
import {HttpErrorResponse} from "@angular/common/http";
import {Task} from "../../../../api/Task";
import {filter, switchMap} from "rxjs";
import {AuthService} from "../../../../service/auth.service";
import {UserService} from "../../../../service/user.service";
import {TaskService} from "../../../../service/task.service";
import {Technology} from "../../../../api/technology";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [MessageService]
})
export class ProjectDetailComponent implements OnInit, AfterViewInit{
    project: Project={};
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

    technologies: { label: string, value: number }[] = [];

    ownerChargeDialogVisible: boolean = false;
    ownerChargeDetails: any[] = [];
    selectedOwnerId: number | null = null;

    documents: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private projectService: ProjectService,
        private authService: AuthService,
        private userService: UserService,
        private taskService: TaskService,
        private messageService: MessageService,
        private location: Location,
        private cdRef: ChangeDetectorRef,
        private router: Router
    ) {}

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }
        ngOnInit() {
            // Récupérer l'ID du projet depuis l'URL
            const projectId:number = Number(this.route.snapshot.params['id']);

            // // Charger les détails du projet
            // this.projectService.getProjectByIdStatic(projectId).then(project => {
            //     this.project = project;
            //     console.log(projectId);
            //     console.log("project detail");
            //     console.log(this.project);
            // });

            this.userService.getTechnologies().subscribe(techs => {
                this.technologies = techs.map(t => ({
                    label: t.name,
                    value: t.id
                }));
            });

            this.projectService.getProjectById(projectId).subscribe({
                next: (project: Project) => {
                    this.project = project;
                    // Vérifier s'il y a des tâches et formater les dates
                    if (this.project.tasks && this.project.tasks.length > 0) {
                        this.project.tasks.forEach(task => {
                            if (task.startDate) {
                                task.startDate = new Date(task.startDate);
                            }
                            if (task.endDate) {
                                task.endDate =  new Date(task.endDate);
                            }
                        });
                    }
                    console.log("Project ID:", projectId);
                    console.log("Project detail:", this.project);
                },
                error: (error) => {
                    console.error("Error in loading the project :", error);
                }
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
                { label: 'Completed', value: 'completed' },
            ];

            // this.authService.currentUser$.pipe(
            //     filter(u => !!u),
            //     switchMap(user  =>
            //         this.userService.getCollabrators()
            //
            //     )
            // ).subscribe(pms => {
            //     this.owners = pms.map(pm => ({
            //         label: `${pm.firstName} ${pm.lastName}`,
            //         value: pm.id
            //     }));
            //     console.log("owners: ")
            //     console.log(this.owners);
            // });
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
            status: {
                name: 'to_come'
            },
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

    /*
    start logic and style days remaining
     */
    getDaysRemaining(task: any): number {
        return task.estimatedWorkDays - task.actualWorkDays;
    }

    getDaysRemainingStyle(task: any): string {
        const diff = this.getDaysRemaining(task);

        if (diff < 0) {
            return 'text-red-600 font-semibold';
        } else if (diff === 0 || diff === 1) {
            return 'text-orange-300 font-semibold';
        } else {
            return 'text-blue-600 font-semibold';
        }
    }

    getDaysRemainingDisplay(task: any): number {
        const diff = this.getDaysRemaining(task);
        return Math.abs(diff);
    }

    getDaysRemainingTooltip(task: any): string {
        const diff = this.getDaysRemaining(task);

        if (diff < 0) {
            return 'Delayed days';
        } else if (diff === 0) {
            return 'Last scheduled day';
        } else if (diff === 1) {
            return '1 day remaining';
        } else {
            return `${diff} days remaining`;
        }
    }
    /*
    end logic and style days remaining
     */

    onImageError(event: any) {
        event.target.src = 'assets/demo/images/user/userDefault.png';
    }

    hideDialog() {
        this.taskDialog = false;
        this.submitted = false;
    }


    toggleDuration(value: boolean, event: Event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        this.useDuration = value;
    }

    formatDateToMMDDYYYY(date: Date | string): string | null {
        if (!date) return null;
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    }

    getStatusIdByName(statusName: string): number {
        switch (statusName) {
            case 'to_come': return 1;
            case 'in_progress': return 2;
            case 'completed': return 3;
            default: return 1;
        }
    }

    saveTask() {
        this.submitted = true;

        if (!this.task.name || !this.project.id) {
            return;
        }

        // if(this.task.estimatedWorkDays == null || this.task.estimatedWorkDays <= 0){
        //     return;
        // }

        // if (this.task.estimatedWorkDays == null || this.task.estimatedWorkDays <= 0) {
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'Validation Error',
        //         detail: 'Estimated work days is required.',
        //         life: 3000
        //     });
        //     return;
        // }

        // -- GESTION DATES & DURÉE --
        if (this.useDuration) {
            // Mode durée => on calcule endDate
            if (this.task.duration && this.task.startDate) {
                const startDate = new Date(this.task.startDate);
                // startDate.setDate(startDate.getDate() + this.task.estimatedWorkDays);
                // this.task.endDate = startDate;
                this.task.endDate = this.addWorkingDays(startDate, this.task.duration);
            }
        } else {
            // Mode date => on calcule estimatedWorkDays
            if (this.task.startDate && this.task.endDate) {
                const start = new Date(this.task.startDate);
                const end = new Date(this.task.endDate);
                // const diff = end.getTime() - start.getTime();
                // this.task.estimatedWorkDays = Math.round(diff / (1000 * 3600 * 24));
                if (end < start) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de date',
                        detail: 'End date must not be less than start date.',
                        life: 3000
                    });
                    return; // annule l'enregistrement
                }
                this.task.duration = this.countWorkingDays(start, end);

            }
        }

        // -- CALCUL PROGRESSION --
        let progress = 0;
        if (this.task.actualWorkDays != null && this.task.estimatedWorkDays && this.task.estimatedWorkDays > 0) {
            progress = Math.round((this.task.actualWorkDays / this.task.estimatedWorkDays) * 100);
        }

        const payload = {
            id: this.task.id,
            name: this.task.name,
            description: this.task.description,
            startDate: this.formatDateToMMDDYYYY(this.task.startDate),
            endDate: this.formatDateToMMDDYYYY(this.task.endDate),
            estimatedWorkDays: this.task.estimatedWorkDays,
            duration: this.task.duration,
            actualWorkDays: this.task.actualWorkDays,
            completionPercentage: this.task.completionPercentage,
            progress: progress,
            projectId: this.project.id,
            ownerId: this.task.ownerId,
            technologyId: this.task.technologyId,
            status: {
                id: this.getStatusIdByName(this.task.status.name)
            }
        };

        // -- UPDATE --
        if (this.task.id) {
            this.taskService.updateTask(payload).subscribe({
                next: (updatedTask) => {
                    console.log("payload: ")
                    console.log(payload)

                    console.log("updatedTask: ")
                    console.log(updatedTask)
                    const index = this.project.tasks.findIndex(t => t.id === updatedTask.id);
                    if (index !== -1) {
                        updatedTask.startDate = updatedTask.startDate ? new Date(updatedTask.startDate) : null;
                        updatedTask.endDate = updatedTask.endDate ? new Date(updatedTask.endDate) : null;
                        // remplace la tâche dans la liste locale
                        this.project.tasks[index] = updatedTask;
                        this.project.tasks = [...this.project.tasks]; // déclenche la détection de changement
                    }
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Updated', life: 3000 });
                    this.taskDialog = false;
                    this.task = {};
                    this.submitted = false;
                },
                error: err => {
                    console.error("Erreur lors de la mise à jour :", err);
                    const detail = err.error?.message ?? 'Task not updated.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
                }
            });
        }
        // -- CREATE --
        else {
            this.taskService.createTask(payload).subscribe({
                next: (createdTask) => {
                    //formter les dates pour les filtrages
                    if(createdTask.startDate){
                        createdTask.startDate = new Date(createdTask.startDate);
                    }
                    if (createdTask.endDate){
                        createdTask.endDate = new Date(createdTask.endDate);
                    }

                    this.project.tasks = [...(this.project.tasks || []), createdTask];
                    this.taskDialog = false;
                    this.task = {};
                    this.submitted = false;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Created', life: 3000 });
                },
                error: err => {
                    console.error("Erreur lors de la création :", err);
                    const detail = err.error?.message ?? 'Task not created.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
                }
            });
        }
    }


    editTask(task: Task) {
        this.task = {
            ...task,
            status: { name: task.status?.name.toLowerCase() ?? 'to_come' },
            ownerId: task.ownerId
        };
        this.useDuration = false; // facultatif : remettre le mode date
        //this.taskDialog = true;
        this.submitted = false;
        // setTimeout(() => {
        //     this.loadOwnersWithAvailability();
        // }

        this.loadOwnersWithAvailability().then(() => {
            this.taskDialog = true;
        });

    }
    trashTask(task: Task){

    }

    goBackToProjectList() {
        //this.router.navigate(['/projects']);
        this.location.back();
    }

    countWorkingDays(startDate: Date, endDate: Date): number {
        let count = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) { // pas dimanche (0) ni samedi (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    addWorkingDays(startDate: Date, workingDays: number): Date {
        const result = new Date(startDate);
        let addedDays = 0;

        while (addedDays < workingDays-1) {
            result.setDate(result.getDate() + 1);
            const day = result.getDay();
            if (day !== 0 && day !== 6) { // si ce n’est pas dimanche (0) ni samedi (6)
                addedDays++;
            }
        }

        return result;
    }



    // loadOwnersWithAvailability() {
    //     if (!this.task.technologyId || !this.task.startDate || !this.task.endDate) {
    //         this.owners = [];
    //         return;
    //     }
    //
    //     const start = this.formatDateToYYYYMMDD(this.task.startDate);
    //     const end = this.formatDateToYYYYMMDD(this.task.endDate);
    //
    //     this.userService.getCollabrators().subscribe(collabs => {
    //         const selectedTechId = this.task.technologyId;
    //         const ownersWithLoad: any[] = [];
    //
    //         collabs
    //             .filter(user=> user.technologies?.some(t => t.id === selectedTechId))
    //             .forEach(user => {
    //             this.userService.getOwnerAvailability(user.id, start, end).subscribe(load => {
    //                 ownersWithLoad.push({
    //                     label: `${user.firstName} ${user.lastName} — ${load.comment}`,
    //                     value: user.id,
    //                     loadInfo: load,
    //                     technologies: user.technologies
    //                 });
    //
    //                 // Trier par charge croissante (optionnel)
    //                 this.owners = ownersWithLoad.sort((a, b) => a.loadInfo.chargeDays - b.loadInfo.chargeDays);
    //             });
    //         });
    //     });
    // }

    loadOwnersWithAvailability(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.task.technologyId || !this.task.startDate || !this.task.endDate) {
                this.owners = [];
                resolve();
                return;
            }

            const start = this.formatDateToYYYYMMDD(this.task.startDate);
            const end = this.formatDateToYYYYMMDD(this.task.endDate);

            this.userService.getCollabrators().subscribe(collabs => {
                const selectedTechId = this.task.technologyId;
                const ownersWithLoad: any[] = [];

                let completedRequests = 0;
                const totalRequests = collabs.filter(user => user.technologies?.some(t => t.id === selectedTechId)).length;

                collabs
                    .filter(user => user.technologies?.some(t => t.id === selectedTechId))
                    .forEach(user => {
                        this.userService.getOwnerAvailability(user.id, start, end, this.task?.id).subscribe(load => {
                            ownersWithLoad.push({
                                label: `${user.firstName} ${user.lastName} — ${load.comment}`,
                                value: user.id,
                                loadInfo: load,
                                technologies: user.technologies
                            });
                            completedRequests++;
                            if (completedRequests === totalRequests) {
                                this.owners = ownersWithLoad.sort((a, b) => a.loadInfo.chargeDays - b.loadInfo.chargeDays);
                                resolve();
                            }
                        });
                    });

                if (totalRequests === 0) {
                    this.owners = [];
                    resolve();
                }
            });
        });
    }

    formatDateToYYYYMMDD(date: Date | string): string {
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }


    onTaskFieldChange() {
        if (this.task.startDate && this.task.endDate) {
            const start = new Date(this.task.startDate);
            const end = new Date(this.task.endDate);

            if (end >= start) {
                this.task.estimatedWorkDays = this.countWorkingDays(start, end);
            } else {
                this.task.estimatedWorkDays = null; // ou 0
            }
        } else {
            this.task.estimatedWorkDays = null;
        }
        this.loadOwnersWithAvailability();
    }

    // showOwnerChargeDetails() {
    //     if (!this.task.ownerId || !this.task.startDate || !this.task.endDate) return;
    //
    //     const start = this.formatDateToYYYYMMDD(this.task.startDate);
    //     const end = this.formatDateToYYYYMMDD(this.task.endDate);
    //     this.selectedOwnerId = this.task.ownerId;
    //
    //     this.userService.getOwnerChargeDetails(this.task.ownerId, start, end).subscribe(data => {
    //         this.ownerChargeDetails = data;
    //         this.ownerChargeDialogVisible = true;
    //     });
    // }

    showOwnerChargeDetailsFromList(ownerId: number) {
        if (!this.task.startDate || !this.task.endDate) return;

        const start = this.formatDateToYYYYMMDD(this.task.startDate);
        const end = this.formatDateToYYYYMMDD(this.task.endDate);

        this.userService.getOwnerChargeDetails(ownerId, start, end, this.task?.id).subscribe(data => {
            this.ownerChargeDetails = data;
            this.selectedOwnerId = ownerId;
            this.ownerChargeDialogVisible = true;
        });
    }

    //µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ
    loadDocuments() {
        if (this.project?.id) {
            this.projectService.getDocuments(this.project.id).subscribe({
                next: (docs) => (this.documents = docs),
                error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec chargement documents' })
            });
        }
    }

    onDocumentSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input?.files?.[0];
        if (file && this.project?.id) {
            const formData = new FormData();
            formData.append('file', file);

            this.projectService.uploadDocument(this.project.id, formData).subscribe({
                next: (doc) => {
                    //this.documents.push(doc);
                    this.project.documents = [...(this.project.documents || []), doc]; // push sans muter
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Document téléversé' });
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec upload' })
            });
        }
    }

    downloadDocument(docId: number) {
        // this.projectService.downloadDocument(docId).subscribe(blob => {
        //     const url = window.URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'document_' + docId;
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        // });
        this.projectService.downloadDocument(docId).subscribe(blob => {
            //const url = window.URL.createObjectURL(blob);
            //const url = `D:\\sujet de stage PFE\\project-management\\project-management-backend\\uploads\\documents/${doc.name}`;
            //window.open(url); // ← ouvre dans un nouvel onglet
        });

    }

    deleteDocument(docId: number) {
        this.projectService.deleteDocument(docId).subscribe(() => {
            //this.documents = this.documents.filter(d => d.id !== docId);
            this.project.documents = this.project.documents.filter(d => d.id !== docId);this.project.documents = this.project.documents.filter(d => d.id !== docId);
            this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Document supprimé' });
        });
    }

    /*
    start time indicator
     */
    private countBusinessDays(from: Date, to: Date): number {
        let count = 0;
        const current = new Date(from);

        // avancer d'un jour à chaque boucle
        while (current <= to) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) { // exclure dimanche (0) et samedi (6)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    }

    getTimeIndicator(task: Task): {
        label: string;
        icon: string;
        class: string;
    } {
        if (!task.startDate || !task.endDate) {
            return {
                label: 'N/A',
                icon: 'pi pi-question-circle',
                class: 'text-gray-400'
            };
        }

        const today = new Date();
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (today < start) {
            const daysToStart = this.countBusinessDays(today, start) - 1;
            return {
                label: `${daysToStart} day${daysToStart > 1 ? 's' : ''} to start`,
                icon: 'pi pi-clock',
                class: 'text-cyan-700'
            };
        }

        if (today.getTime() === end.getTime()) {
            return {
                label: 'Last scheduled day',
                icon: 'pi pi-calendar-times',
                class: 'text-orange-600 font-medium'
            };
        }

        if (today > end) {
            if (task.status?.name?.toLowerCase() === 'completed') {
                return {
                    label: 'Completed',
                    icon: 'pi pi-check-circle',
                    class: 'text-gray-500'
                };
            }
            const delayedDays = this.countBusinessDays(end, today) - 1;
            return {
                label: `${delayedDays} delayed day${delayedDays > 1 ? 's' : ''}`,
                icon: 'pi pi-exclamation-triangle',
                class: 'text-red-500 font-bold'
            };
        }

        const remainingDays = this.countBusinessDays(today, end) - 1;
        return {
            label: `${remainingDays} day${remainingDays > 1 ? 's' : ''} remaining`,
            icon: 'pi pi-hourglass',
            class: 'text-green-500'
        };
    }
    /*
    end time indicator
     */

}
