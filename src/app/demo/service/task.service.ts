// task.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../api/Task';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private baseUrl = 'http://localhost:8084/api/tasks';

    constructor(private http: HttpClient) {}

    createTask(task: any): Observable<Task> {
        return this.http.post<Task>(this.baseUrl, task);
    }

    updateTask(task: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${task.id}`, task);
    }
}
