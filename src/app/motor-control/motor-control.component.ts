import { Component, OnInit } from '@angular/core';
import { LayoutStateService } from '../services/layout-state.service';
import { MotorControlGamepad } from '../models/motor-control-gamepad';
import { WebSocketService } from '../services/websocket.service';
import { environment } from 'src/environments/environment';
import { GamepadInputService } from '../services/gamepad-input.service';
import { interval } from 'rxjs';
import { MotorControl } from '../models/motor-control';

@Component({
  selector: 'app-motor-control',
  templateUrl: './motor-control.component.html',
  styleUrls: ['./motor-control.component.scss']
})
export class MotorControlComponent implements OnInit {
  public gamepads: Gamepad[] = [];
  public motorControls: MotorControlGamepad[];
  public webSocketService: WebSocketService;
  private lastSentValue: {[motorControlId: number]: number} = {};

  constructor(private gamepadInputService: GamepadInputService, layoutStateService: LayoutStateService, wsService: WebSocketService) {
    this.webSocketService = wsService;
    layoutStateService.getMotorControlsAsync()
      .subscribe(motorControls => this.motorControls = motorControls as MotorControlGamepad[]);

    interval(environment.gamepadPollingInterval)
      .subscribe(x => {
        gamepadInputService.getGamepads().forEach(gp => {
          if (!this.gamepads.map(i => i.id).includes(gp.id)){
            this.gamepads.push(gp);
          }
        });
      });
   }

  ngOnInit(): void {
  }

  public onSliderChange(motorControl: MotorControl): void {
    if (this.lastSentValue[motorControl.id] === undefined || this.lastSentValue[motorControl.id] === null){
      this.lastSentValue[motorControl.id] = motorControl.speed;
      this.webSocketService.sendMotorControlCmdAsync(motorControl);
    } else if (Math.abs(motorControl.speed - this.lastSentValue[motorControl.id]) >= environment.sliderUpdateIncrement ){
      this.lastSentValue[motorControl.id] = motorControl.speed;
      this.webSocketService.sendMotorControlCmdAsync(motorControl);
    }
  }

  public onSliderMouseUp(motorControl: MotorControl): void {
    this.lastSentValue[motorControl.id] = motorControl.speed;
    this.webSocketService.sendMotorControlCmdAsync(motorControl);
  }

  public toggleConnectionToGamepad(motorControl: MotorControlGamepad): void {
    if (motorControl.isConnected) {
      this.gamepadInputService.connectGamepadToMotorControl(motorControl);
    } else {
      this.gamepadInputService.disconnectGamepadFromMotorControl(motorControl);
    }
  }
}
