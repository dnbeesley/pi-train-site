import { TestBed } from '@angular/core/testing';

import { GamepadInputService } from './gamepad-input.service';

describe('GamepadInputService', () => {
  let service: GamepadInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamepadInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
