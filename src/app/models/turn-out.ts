import { Node } from './node';

export class TurnOut {
    id: number;
    commonNode: Node;
    forwardNode: Node;
    turnOutNode: Node;
    turnedOut: boolean;
}
