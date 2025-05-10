import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-abstract-search',
  templateUrl: './abstract-search.component.html',
  styleUrls: ['./abstract-search.component.scss']
})
export abstract class AbstractSearchComponent {
    protected cacheServices: string[] = []; // Optional caching rule
    //protected API_URL = 'http://localhost:8083/api/v1'; // Replace with your actual API URL
    protected API_URL = 'http://localhost:8082';
    protected authToken = this.getToken(); // You can get it from a service

    constructor(protected http: HttpClient,protected messageService: MessageService) {}

     getToken() {
        const TOKEN_KEY = 'auth_token';
        const token = window.localStorage.getItem(TOKEN_KEY);
        if (!token){
            return "";
        }
        return token.replace(/^"(.*)"$/, '$1'); // Removes surrounding quotes if present
    }

    showSuccess(message?:string) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: message||'Operation has been successfully completed' });
    }
    showWarning(message?:string) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail:message||'Attention to this warning message' });
    }
    showError(message?:string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail:message|| 'Operation has been failed',
            life: 10000});
    }

    async postFetch(entity: any, config: { service: string, headers?: any }, callbackFunction: Function): Promise<void> {
        if (!config || !config.service) {
            throw new Error("Invalid config: service must be provided.");
        }

        const cacheKey = `cache_${config.service}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (this.cacheServices.includes(config.service) && cachedData) {
            console.log(`✅ Using cached data for ${config.service}`);
            callbackFunction(JSON.parse(cachedData));
            return;
        }

        let headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        });

        if (config.headers) {
            Object.keys(config.headers).forEach(key => {
                headers = headers.set(key, config.headers[key]);
            });
        }

        try {
            const result = await this.http.post(`${this.API_URL}/${config.service}`, entity, { headers }).toPromise();

            if (this.cacheServices.includes(config.service)) {
                localStorage.setItem(cacheKey, JSON.stringify(result));
            }

            callbackFunction(result);
        } catch (error) {
            console.error("❌ Error occurred:", error);
            const errorMessage = error?.error?.error || 'Unknown error occurred in post';
            this.showError(errorMessage);
        }
    }
    async putFetch(entity: any, config: { service: string, headers?: any }, callbackFunction: Function): Promise<void> {
        if (!config || !config.service) {
            throw new Error("Invalid config: service must be provided.");
        }

        let headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        });

        if (config.headers) {
            Object.keys(config.headers).forEach(key => {
                headers = headers.set(key, config.headers[key]);
            });
        }

        try {
            const result = await this.http.put(`${this.API_URL}/${config.service}`, entity, { headers }).toPromise();
            callbackFunction(result);
        } catch (error) {
            console.error("❌ PUT error:", error);
            const errorMessage = error?.error?.error || 'Unknown error occurred in put ';
            this.showError(errorMessage);
        }
    }
    async deleteFetch(config: { service: string, headers?: any, params?: any }, callbackFunction: Function): Promise<void> {
        if (!config || !config.service) {
            throw new Error("Invalid config: service must be provided.");
        }

        let headers = new HttpHeaders({
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        });

        if (config.headers) {
            Object.keys(config.headers).forEach(key => {
                headers = headers.set(key, config.headers[key]);
            });
        }

        try {
            const options: any = {
                headers,
                body: config.params || null, // if your DELETE requires a body
            };

            const result = await this.http.delete(`${this.API_URL}/${config.service}`, options).toPromise();
            callbackFunction(result);
        } catch (error) {
            console.error("❌ DELETE error:", error);
            const errorMessage = error?.error?.error || 'Unknown error occurred';
            this.showError(errorMessage);
        }
    }

}
export class DataNotFoundException extends Error {
    constructor(entity: string) {
        super(`Data not found for entity: ${entity}`);
        this.name = 'DataNotFoundException';
    }
}
