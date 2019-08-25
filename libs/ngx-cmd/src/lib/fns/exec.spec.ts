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

describe('Exec', () => {
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

  it('should log and throw an error when service is not found', done => {
    const exec = execEmpty(undefined);
    console.error = jest.fn();
    exec('test').subscribe({
      error: err => {
        expect(console.error).toBeCalledWith('Command service was not found');
        expect(err).toBe('Command service was not found');
        done();
      }
    });
  });
});
