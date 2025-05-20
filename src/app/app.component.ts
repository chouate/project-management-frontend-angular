import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {KeycloakService} from "keycloak-angular";
import {AuthService} from "./demo/service/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
                private keycloak: KeycloakService,
                private auth: AuthService
    ) { }

    async  ngOnInit() {
        this.primengConfig.ripple = true;

        if (await this.keycloak.isLoggedIn()) {
            this.auth.loadCurrentUser().subscribe();
        }

        // 2) À chaque rafraîchissement de token, on recharge l'utilisateur
        const kc = this.keycloak.getKeycloakInstance();
        kc.onTokenExpired = () => {
            console.log('Token expiré, je reload /api/me');
            this.auth.loadCurrentUser().subscribe();
        };
    }
}
