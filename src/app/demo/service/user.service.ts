import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import {User} from "../api/user";
import {Observable} from "rxjs";
import {Technology} from "../api/technology";

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    // getCollaborators() {
    //     return this.http.get<any>('assets/demo/data/collaborators.json')
    //         .toPromise()
    //         .then(res => res.data as User[])
    //         .then(data => data);
    // }

    getCollabrators(): Observable<User[]> {
        return this.http.get<User[]>('http://localhost:8081/api/collaborators');
    }

    getTechnologies(): Observable<Technology[]>{
        return this.http.get<Technology[]>('http://localhost:8081/technologies');
    }

    /** Update the list of technologies for a collaborator */
    updateUserTechnologies(collaboratorId: number, techIds: number[]): Observable<User> {
        return this.http.put<User>(
            `http://localhost:8081/api/users/${collaboratorId}/assign/technologies`, techIds
        );
    }

}
