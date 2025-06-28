import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MessageService} from "primeng/api";
import {AuthService} from "../../../../service/auth.service";
import {TaskService} from "../../../../service/task.service";
import { Task } from '../../../../api/Task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
    providers: [MessageService]
})
export class TaskListComponent implements OnInit{
    tasks: Task[] = [];
    loading: boolean = true;
    @ViewChild('filter') filter!: ElementRef;

    taskStatuses: any[] = [];
    editingStatusTaskId: number | null = null;


    constructor(
        private taskService: TaskService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const currentUserId = this.authService.getCurrentUserId();
        if (currentUserId) {
            this.taskService.getTasksByOwnerId(currentUserId).subscribe({
                next: (data) => {
                    this.tasks = data.map(t => ({
                        ...t,
                        startDate: t.startDate ? new Date(t.startDate) : null,
                        endDate: t.endDate ? new Date(t.endDate) : null,
                    }));
                    this.loading = false;
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load tasks.' });
                    this.loading = false;
                }
            });
        }

        this.taskStatuses = [ //utiliser toLowerCase pour les valeurs
            { label: 'To come', value: 'to_come' },
            { label: 'In progress', value: 'in_progress' },
            { label: 'Completed', value: 'completed' },
        ];
    }

    // updateCompletion(task: Task): void {
    //     const payload = { completionPercentage: task.completionPercentage };
    //     this.taskService.updateCompletionPercentageTask(task.id, payload).subscribe({
    //         next: () => {
    //             this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Completion % updated.' });
    //         },
    //         error: () => {
    //             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed.' });
    //         }
    //     });
    // }

    updateCompletion(task: Task): void {
        // Auto-assign status based on completion
        if (task.completionPercentage === 100) {
            task.status.name = 'COMPLETED';
        } else if (task.completionPercentage === 0) {
            task.status.name = 'TO_COME';
        } else {
            task.status.name = 'IN_PROGRESS';
        }

        const payload = {
            completionPercentage: task.completionPercentage,
            status: task.status.name
        };

        this.taskService.updateCompletionPercentageTask(task.id, payload).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Progress updated.' });
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed.' });
            }
        });
    }

    onStatusChange(task: Task) {
        // reconstruire l'objet pour éviter l'immutabilité partielle
        task.status = { ...task.status, name: task.status.name };

        // Mise à jour automatique du pourcentage selon le statut
        if (task.status.name === 'completed') {
            task.completionPercentage = 100;
        } else {
            task.completionPercentage = 0;
        }

        const payload = {
            completionPercentage: task.completionPercentage,
            status: task.status.name.toUpperCase()
        };

        this.taskService.updateCompletionPercentageTask(task.id, payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Status updated.'
                });
                this.editingStatusTaskId = null;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Status update failed.'
                });
            }
        });
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: any) {
        table.clear();
        this.filter.nativeElement.value = '';
    }


}
