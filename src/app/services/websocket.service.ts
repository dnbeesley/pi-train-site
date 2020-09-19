import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MotorControl } from '../models/motor-control';
import { Observable } from 'rxjs';
import { TurnOut } from '../models/turn-out';

// Declare SockJS and Stomp
declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() {
    this.initializeWebSocketConnection();
  }

  private stompClient;
  private connectedPromise: Promise<any>;

  initializeWebSocketConnection() {
    const ws = new SockJS(environment.webSocketUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;

    this.connectedPromise =  new Promise(resolve => {
      this.stompClient.connect({}, frame => {
        resolve();
      });
    });
  }

  getCmdAsync<TCmd>(source: string): Observable<TCmd>{
    return new Observable<TCmd>(observer => {
      this.connectedPromise.then(() => {
        this.stompClient.subscribe(source, (message: { body: string; }) => {
          if (message.body) {
            observer.next(JSON.parse(message.body));
          }
        });
      });
    });
  }

  getMotorControlCmdAsync(): Observable<MotorControl>{
    return this.getCmdAsync<MotorControl>('/topic/motor-control');
  }

  getTurnOutCmdAsync(): Observable<TurnOut>{
    return this.getCmdAsync<TurnOut>('/topic/turn-out');
  }

  sendCmdAsync<TCmd>(destination: string, command: TCmd) {
    this.connectedPromise.then(() => {
      this.stompClient.send(destination , {}, JSON.stringify(command));
    });
  }

  sendMotorControlCmdAsync(motorControl: MotorControl) {
    this.sendCmdAsync<MotorControl>('/app/send/motor-control', motorControl);
  }

  sendTurnOutCmdAsync(turnOut: TurnOut) {
    this.sendCmdAsync<TurnOut>('/app/send/turn-out', turnOut);
  }
}
