import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CommandService } from '../command.service';
import { registerEmpty } from './register';

class Test {
  number = 0;

  constructor(svc: CommandService) {
    svc.registerCommand('test', this.setNumber.bind(this));
  }

  setNumber(): void {
    this.number = 3;
  }
}

let service: CommandService;

describe('CommandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CommandService);
  });

  it('should execute command', () => {
    const regCmd = registerEmpty(TestBed.get(Injector));
    regCmd('test', () => {});
    expect((service as any).commands.get('test')).toBeTruthy();
  });
});
