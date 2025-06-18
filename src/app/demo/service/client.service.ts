import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {Client} from "../api/client";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    private readonly apiUrl = 'http://localhost:8088';

    constructor(private http: HttpClient) { }
    // getClients() {
    //     return this.http.get<any>('http://localhost:8082/clients/getAll')
    //         .toPromise()
    //         .then(res => res.data as Client[])
    //         .then(data => data);
    // }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>('http://localhost:8088/api/clients/getAll');
    }

    getClientsByDirector(directorId: number): Observable<Client[]> {
        return this.http.get<Client[]>(
            `${this.apiUrl}/api/directors/${directorId}/clients`
        );
    }

    getClientsByPM(id: number): Observable<Client[]> {
        return this.http.get<Client[]>(
            `${this.apiUrl}/api/projectManagers/${id}/clients`
        );
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>('http://localhost:8088/api/clients', client);
    }

    updateClient(client: Client): Observable<Client> {
        return this.http.patch<Client>(`http://localhost:8088/api/clients/${client.id}`, client);
    }

    deleteClient(id: number): Observable<any>{
        return this.http.delete(`http://localhost:8088/api/clients/${id}`);
    }



}
