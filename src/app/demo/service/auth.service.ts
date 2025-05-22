import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../api/user";
import {KeycloakService} from "keycloak-angular";

@Injectable({
    providedIn: 'root'
})
export class AuthService  {


    currentUser$ = new BehaviorSubject<User|null>(null);

    constructor(private http: HttpClient, private keycloak: KeycloakService) {}

    loadCurrentUser() {
        return this.http.get<User>('http://localhost:8081/api/me').pipe(
            tap(user => this.currentUser$.next(user))
        );
    }

    getUserRole(): string {
        return this.currentUser$.getValue()?.role || '';
    }
}
