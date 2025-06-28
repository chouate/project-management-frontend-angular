import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../api/client";
import {Technology} from "../api/technology";

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

    private readonly apiUrl = 'http://localhost:8081/technologies';
    constructor(
        private http: HttpClient,
    ) { }

    getTechnologies(): Observable<Technology[]> {
        return this.http.get<Technology[]>('http://localhost:8081/technologies');
    }

    // Récupérer une technologie par ID
    getTechnologyById(id: number): Observable<Technology> {
        return this.http.get<Technology>(`${this.apiUrl}/${id}`);
    }

    // Créer une nouvelle technologie
    createTechnology(technology: Technology): Observable<Technology> {
        return this.http.post<Technology>(this.apiUrl, technology);
    }

    // Mettre à jour une technologie
    updateTechnology(technology: Technology): Observable<Technology> {
        return this.http.put<Technology>(`${this.apiUrl}/${technology.id}`, technology);
    }

    // Supprimer une technologie
    deleteTechnology(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
