import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Client} from "../api/client";
import {Technology} from "../api/technology";

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

    private readonly apiUrl = 'http://localhost:8081';
    constructor(
        private http: HttpClient,
    ) { }

    getTechnologies(): Observable<Technology[]> {
        return this.http.get<Technology[]>('http://localhost:8081/technologies');
    }
}
