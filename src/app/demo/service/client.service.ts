import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {Client} from "../api/client";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private http: HttpClient) { }
    // getClients() {
    //     return this.http.get<any>('http://localhost:8082/clients/getAll')
    //         .toPromise()
    //         .then(res => res.data as Client[])
    //         .then(data => data);
    // }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>('http://localhost:8082/clients/getAll');
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>('http://localhost:8082/clients', client);
    }

    updateClient(client: Client): Observable<Client> {
        return this.http.patch<Client>(`http://localhost:8082/clients/${client.id}`, client);
    }

    deleteClient(id: number): Observable<any>{
        return this.http.delete(`http://localhost:8082/clients/${id}`);
    }


    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }


    getProducts() {
        return this.http.get<any>('assets/demo/data/products.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
