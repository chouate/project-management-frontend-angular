import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {Client} from "../api/client";
import {Observable} from "rxjs";
import {Customer} from "../api/customer";
import {Project} from "../api/Project";

@Injectable({
    providedIn: 'root'
})
export class   ProjectService {

    private readonly apiUrl = 'http://localhost:8083/api';

    constructor(private http: HttpClient) { }

    getAllProjectsByPM(pmId: number): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.apiUrl}/projectManagers/${pmId}/projects`);
    }

    getProjectById(projectId: number): Observable<Project>{
        return this.http.get<Project>(`${this.apiUrl}/projects/${projectId}`);
    }
    createProject(project: any): Observable<Project> {
        return this.http.post<Project>(`${this.apiUrl}/projects`, project);
    }

    updateProject(projectId: number, project: any): Observable<Project> {
        return this.http.put<Project>(`${this.apiUrl}/projects/${projectId}`, project);
    }


    getProjects() {
        return this.http.get<any>('assets/demo/data/test.json')
            .toPromise()
            .then(res => res.data as Customer[])
            .then(data => data);
    }


    getProjectByIdStatic(projectId: number): Promise<any> {
        return this.http.get<any>('assets/demo/data/test.json')
            .toPromise()
            .then(res => {
                const projects = res.data;
                return projects.find((project: any) => project.id === projectId);
            });
    }


}
