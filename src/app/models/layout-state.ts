import { Line } from './line';
import { TurnOut } from './turn-out';

export class LayoutState {
    lines: Line[];
    height: number;
    turnOuts: TurnOut[];
    width: number;
}
