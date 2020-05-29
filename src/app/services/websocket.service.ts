import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { MotorControl } from '../models/motor-control';
import { Observable } from 'rxjs';

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

  getMotorControlCmdAsync(): Observable<MotorControl>{
    return new Observable<MotorControl>(observer => {
      this.connectedPromise.then(() => {
        this.stompClient.subscribe('/topic/motor-control', message => {
          if (message.body) {
            observer.next(JSON.parse(message.body));
          }
        });
      });
    });
  }

  sendMotorControlCmdAsync(motorControl: MotorControl) {
    this.connectedPromise.then(() => {
      this.stompClient.send('/app/send/motor-control' , {}, JSON.stringify(motorControl));
    });
  }
}
