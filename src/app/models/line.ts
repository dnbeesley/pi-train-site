import { Node } from './node';
import { MotorControl } from './motor-control';

export class Line {
    endNode: Node;
    motorControl: MotorControl;
    startNode: Node;
}
