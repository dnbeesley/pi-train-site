import { Component, OnInit, Input } from '@angular/core';

import { Line } from '../models/line';
import { TurnOut } from '../models/turn-out';
import { LayoutState } from '../models/layout-state';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    constructor() { }

    @Input() public state: LayoutState;

    ngOnInit(): void {
    }

    public getLinePoints(line: Line): string {
      const centerX = (line.startNode.left + line.endNode.left) / 2;
      const centerY = (line.startNode.top + line.endNode.top) / 2;
      return line.motorControl.isReversed ?
        `${line.endNode.left},${line.endNode.top} ${centerX},${centerY} ${line.startNode.left},${line.startNode.top}` :
        `${line.startNode.left},${line.startNode.top} ${centerX},${centerY} ${line.endNode.left},${line.endNode.top}`;
    }

}
