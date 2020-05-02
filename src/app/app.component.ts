import { Component } from '@angular/core';

import { LayoutState } from './models/layout-state';
import { LayoutStateService } from './services/layout-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public data: LayoutState;

    constructor(private layoutStateService: LayoutStateService) {
        this.layoutStateService.getStateAsync()
            .subscribe((data: LayoutState) => this.data = data);
    }
}
