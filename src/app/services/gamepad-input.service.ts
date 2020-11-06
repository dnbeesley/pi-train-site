import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { environment } from 'src/environments/environment';
import { MotorControl } from '../models/motor-control';
import { MotorControlGamepad } from '../models/motor-control-gamepad';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class GamepadInputService {
  gamePadConnections: MotorControlGamepad[] = [];

  constructor(websocketService: WebSocketService) {
    window.addEventListener('ongamepaddisconnected', e => {
      const gamePadEvent = e as GamepadEvent;
      this.gamePadConnections = this.gamePadConnections.filter(gp => gp.gamepad.id !== gamePadEvent.gamepad.id);
    });

    interval(environment.gamepadPollingInterval)
    .subscribe(x => {
      this.gamePadConnections.forEach(gpc => {
        let speed: number;
        if (Math.abs(gpc.gamepad.axes[gpc.axis]) > environment.gamepadDeadZone){
          speed = Math.ceil(Math.abs(gpc.gamepad.axes[gpc.axis]) * 255);
        }else{
          speed = 0;
        }

        const reversed = (gpc.gamepad.axes[gpc.axis] < 0) !== !gpc.isInverted;
        if (reversed !== gpc.reversed || speed !== gpc.speed){
          gpc.reversed = reversed;
          gpc.speed = speed;
          websocketService.sendMotorControlCmdAsync(gpc);
        }
      });
    });
   }

   connectGamepadToMotorControl(motorControl: MotorControlGamepad) {
    this.gamePadConnections.push(motorControl);
   }

   disconnectGamepadFromMotorControl(motorControl: MotorControl) {
    this.gamePadConnections = this.gamePadConnections.filter(
      gpc => gpc.id !== motorControl.id);
   }

   getGamepads() {
     return window.navigator.getGamepads().filter(g => g);
   }
}
