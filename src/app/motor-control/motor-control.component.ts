import { Component, OnInit } from '@angular/core';
import { LayoutStateService } from '../services/layout-state.service';
import { MotorControl } from '../models/motor-control';
import { WebSocketService } from '../services/websocket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-motor-control',
  templateUrl: './motor-control.component.html',
  styleUrls: ['./motor-control.component.scss']
})
export class MotorControlComponent implements OnInit {
  public motorControls: MotorControl[];
  public webSocketService: WebSocketService;
  private lastSentValue: {[motorControlId: number]: number} = {};

  constructor(private layoutStateService: LayoutStateService, wsService: WebSocketService) {
    this.webSocketService = wsService;
    this.layoutStateService.getMotorControlsAsync()
        .subscribe(motorControls => this.motorControls = motorControls);
   }

  ngOnInit(): void {
  }

  public onSliderChange(motorControl: MotorControl): void{
    if (this.lastSentValue[motorControl.id] === undefined || this.lastSentValue[motorControl.id] === null){
      this.lastSentValue[motorControl.id] = motorControl.speed;
      this.webSocketService.sendMotorControlCmdAsync(motorControl);
    } else if (Math.abs(motorControl.speed - this.lastSentValue[motorControl.id]) >= environment.sliderUpdateIncrement ){
      this.lastSentValue[motorControl.id] = motorControl.speed;
      this.webSocketService.sendMotorControlCmdAsync(motorControl);
    }
  }

  public onSliderMouseUp(motorControl: MotorControl): void{
    this.lastSentValue[motorControl.id] = motorControl.speed;
    this.webSocketService.sendMotorControlCmdAsync(motorControl);
  }
}
