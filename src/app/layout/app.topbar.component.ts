import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'

})
export class AppTopBarComponent implements OnInit{
    public profile! : KeycloakProfile;

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private keycloakService: KeycloakService
    ) { }

    ngOnInit() {
        if(this.keycloakService.isLoggedIn()){
            this.keycloakService.loadUserProfile().then(profile=>{
                this.profile=profile;
            });
        }

    }

    async handleLogin() {
        await this.keycloakService.login({
            redirectUri: window.location.origin
        });
    }

    handleLogout(){
        this.keycloakService.logout(window.location.origin);
    }
}
