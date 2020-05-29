import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LayoutState } from '../models/layout-state';
import { MotorControl } from '../models/motor-control';

@Injectable({
    providedIn: 'root'
})
export class LayoutStateService {

    constructor(private http: HttpClient) { }

    getMotorControlsAsync(): Observable<MotorControl[]> {
      return this.http.get<MotorControl[]>(`${environment.layoutStateBaseUrl}/motor-control`);
    }

    getStateAsync(): Observable<LayoutState> {
        return this.http.get<LayoutState>(environment.layoutStateBaseUrl);
    }
}
