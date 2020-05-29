import { Component, OnInit, Input } from '@angular/core';

import { Line } from '../models/line';
import { LayoutState } from '../models/layout-state';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(wsService: WebSocketService) {
    wsService.getMotorControlCmdAsync().subscribe(mc => {
      if (this.state && this.state.lines){
        this.state.lines.forEach(l => {
          if (l.motorControl.id === mc.id){
            l.motorControl = mc;
          }
        });
      }
    });
  }

  @Input() public state: LayoutState;

  ngOnInit(): void {
  }

  public getLinePoints(line: Line): string {
    const centerX = (line.startNode.left + line.endNode.left) / 2;
    const centerY = (line.startNode.top + line.endNode.top) / 2;
    return line.motorControl.reversed ?
      `${line.endNode.left},${line.endNode.top} ${centerX},${centerY} ${line.startNode.left},${line.startNode.top}` :
      `${line.startNode.left},${line.startNode.top} ${centerX},${centerY} ${line.endNode.left},${line.endNode.top}`;
  }
}
