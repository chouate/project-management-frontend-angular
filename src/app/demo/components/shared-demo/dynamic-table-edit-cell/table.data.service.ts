import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private http: HttpClient) { }

  getColumns(): Observable<any> {
    return this.http.get('/assets/data/table.columns.names.json');
  }

  getData(): Observable<any> {
    return this.http.get('/assets/data/data-table.json');
  }
}
