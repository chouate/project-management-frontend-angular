import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {Client} from "../api/client";
import {Observable} from "rxjs";
import {Customer} from "../api/customer";

@Injectable({
    providedIn: 'root'
})
export class   ProjectService {

    private readonly apiUrl = 'http://localhost:8082';

    constructor(private http: HttpClient) { }
    getProjects() {
        return this.http.get<any>('assets/demo/data/test.json')
            .toPromise()
            .then(res => res.data as Customer[])
            .then(data => data);
    }


}
