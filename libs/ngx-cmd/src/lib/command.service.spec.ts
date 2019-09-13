// tslint:disable:max-classes-per-file //
import { TestBed } from '@angular/core/testing';

import { CommandService, ExecType } from './command.service';

class Test {
  number = 0;

  constructor(svc: CommandService) {
    svc.registerCommand('testArrow', () => (this.number = 5));
    svc.registerCommand('testFn', this.setNumber);
    svc.registerCommand('testBind', this.setNumber.bind(this));
    svc.registerCommand('testReBind', this.setNumber.bind(this));
    svc.registerCommand('testCtx', this.setNumber);
  }

  setNumber(): void {
    this.number = 3;
  }
}

class Test2 {
  variable = {};
  constructor(svc: CommandService) {
    svc.registerCommand('testBind', this.test.bind(this));
    svc.registerCommand('testArrow', args => this.test(args));
    svc.registerCommand('testGiven', this.test);
    svc.registerCommand('testCustom', this.test);
  }
  test(input: any): void {
    this.variable = input;
  }
}

class Test3 {
  constructor(svc: CommandService) {
    svc.registerCommand('testReturn', this.test.bind(this));
  }
  test(): 'abc' {
    return 'abc';
  }
}

class TestEmpty {
  number = 0;
}
// tslint:enable: no-unbound-method

let service: CommandService;

describe('CommandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register command', () => {
    service.registerCommand('test', () => {});

    expect((service as any).commands.test).toBeTruthy();
  });

  describe('Test execution', () => {
    let svc: Test;
    beforeEach(() => (svc = new Test(service)));

    it('it should fail withou correct ctx in custom bind function', () => {
      service.exec('testFn');
      expect(svc.number).toBe(0);
    });

    it('it should pass correct ctx in Arrow fn', () => {
      service.exec('testArrow');
      expect(svc.number).toBe(5);
    });

    it('it should pass correct ctx in Bound fn', () => {
      service.exec('testBind');
      expect(svc.number).toBe(3);
    });

    it(`it won't work when fn is already bounded`, () => {
      const t2 = new TestEmpty();

      expect(svc.number).toBe(0);
      expect(t2.number).toBe(0);

      service.exec('testReBind', undefined, undefined);
      expect(svc.number).toBe(3);
      expect(t2.number).toBe(0);
    });
  });

  describe('Test passing of args', () => {
    let svc: Test2;
    beforeEach(() => (svc = new Test2(service)));

    it('it should pass correct args with bind', () => {
      expect(svc.variable).toEqual({});
      service.exec('testBind', { abc: 'def' });
      expect(svc.variable).toEqual({ abc: 'def' });
    });

    it('it should pass correct args with Arrow fn', () => {
      expect(svc.variable).toEqual({});
      service.exec('testArrow', { abc: 'def' });
      expect(svc.variable).toEqual({ abc: 'def' });
    });
  });

  describe('Test return from command', () => {
    let svc: Test3;
    beforeEach(() => (svc = new Test3(service)));

    it('it should return result', done => {
      service.exec<string>('testReturn').subscribe(result => {
        expect(result).toBe('abc');
        done();
      });
    });

    it('it should throw Error when bad command was used', done => {
      console.error = jest.fn();
      service.exec('test').subscribe(
        _ => {},
        err => {
          expect(err).toBe(`Command 'test' was not found`);
          // tslint:disable-next-line: no-unbound-method
          expect(console.error).toBeCalled();
          done();
        },
      );
    });
  });

  describe('Test existency of command', () => {
    let svc: Test3;
    beforeEach(() => (svc = new Test3(service)));

    it('it should ignore non existance of command', done => {
      console.error = jest.fn();
      service.exec('test', undefined, ExecType.ignore).subscribe({
        complete: () => {
          // tslint:disable-next-line: no-unbound-method
          expect(console.error).not.toBeCalled();
          done();
        },
      });
    });

    it('it should wait until commad is available', done => {
      console.error = jest.fn();
      service.exec('test', undefined, ExecType.wait).subscribe({
        next: data => {
          expect(data).toBe('abc');
          // tslint:disable-next-line: no-unbound-method
          expect(console.error).not.toBeCalled();
          done();
        },
      });
      service.registerCommand('test', () => 'abc');
    });
  });
});

// tslint:enable:max-classes-per-file //
