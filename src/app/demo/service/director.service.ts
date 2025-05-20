import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {Client} from "../api/client";
import {Observable} from "rxjs";
import {User} from "../api/user";

@Injectable({
    providedIn: 'root'
})
export class DirectorService {
    private readonly baseUrl = 'http://localhost:8081/api/directors';

    constructor(private http: HttpClient) { }

    getPMsByDirector(directorId: number): Observable<User[]> {
        const url = `${this.baseUrl}/${directorId}/projectManagers`;
        return this.http.get<User[]>(url);
    }
}
