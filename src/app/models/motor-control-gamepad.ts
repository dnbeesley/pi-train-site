import { MotorControl } from './motor-control';

export class MotorControlGamepad extends MotorControl {
  isConnected: true;
  gamepad: Gamepad;
  axis: number;
  isInverted: boolean;
}
