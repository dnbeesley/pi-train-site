import { Component, OnInit, Input } from '@angular/core';

import { Line } from '../models/line';
import { LayoutState } from '../models/layout-state';
import { WebSocketService } from '../services/websocket.service';
import { TurnOut } from '../models/turn-out';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    wsService.getMotorControlCmdAsync().subscribe(mc => {
      if (this.state && this.state.lines){
        this.state.lines.forEach(l => {
          if (l.motorControl.id === mc.id){
            l.motorControl.reversed = mc.reversed;
            l.motorControl.speed = mc.speed;
          }
        });
      }
    });

    wsService.getTurnOutCmdAsync().subscribe(turnOut => {
      if (this.state && this.state.turnOuts){
        this.state.turnOuts.forEach(to => {
          if (to.id === turnOut.id){
            to.turnedOut = turnOut.turnedOut;
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

  public switch(turnOut: TurnOut): void {
    turnOut.turnedOut = !turnOut.turnedOut;
    this.wsService.sendTurnOutCmdAsync(turnOut);
  }
}
