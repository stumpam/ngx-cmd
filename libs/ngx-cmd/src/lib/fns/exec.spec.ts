import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CommandService } from '../command.service';
import { execEmpty } from './exec';

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
    const exec = execEmpty(TestBed.get(Injector));
    const t = new Test(service);
    expect(t.number).toBe(0);
    exec('test');
    expect(t.number).toBe(3);
  });
});
