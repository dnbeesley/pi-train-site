import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LayoutState } from '../models/layout-state';

@Injectable({
    providedIn: 'root'
})
export class LayoutStateService {

    constructor(private http: HttpClient) { }

    getStateAsync(): Observable<LayoutState> {
        return this.http.get<LayoutState>(environment.apiBaseUrl);
    }
}
