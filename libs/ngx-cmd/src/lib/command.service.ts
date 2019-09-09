import { Injectable } from '@angular/core';
import { EMPTY, isObservable, Observable, of, Subject, throwError } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Event } from './events.interface';
import { switchcase } from './fns/switchcase';

export const enum ExecType {
  'ignore',
  'wait',
}

declare global {
  // tslint:disable-next-line: no-empty-interface
  export interface Cmd {
    // <T>(name: string, payload?: any, ctx?: object): Observable<T>;
  }
}

interface CommandStore {
  [key: string]: CommandStore | UnknownFn;
}
type UnknownFn = (...args: any) => unknown;
type Command = [(...args: any) => unknown, object | undefined];

const ignore = (): Observable<never> => EMPTY;

let cmdß: CommandService | undefined;

export const cmd: Cmd = (name: string, payload?: any, type?: ExecType) =>
  cmdß.exec(name, payload, type);

export const cmdWait: Cmd = (name: string, payload?: any) =>
  cmdß.exec(name, payload, ExecType.wait);

export const cmdIgnore: Cmd = (name: string, payload?: any) =>
  cmdß.exec(name, payload, ExecType.ignore);

export const regCmd = (name: string, fn: (...args: any) => any) =>
  cmdß.registerCommand(name, fn);

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private readonly commands = new Map<string, Command>();
  private readonly commandEvt$ = new Subject<Event>();

  constructor() {
    cmdß = this;
  }

  registerCommand(name: string, fn: (...args: any) => any, ctx?: object): void {
    if (this.commands.has(name)) {
      this.exec('err', `Command ${name} already exists`);
    }

    this.commands.set(name, [fn, ctx]);
    this.commandEvt$.next({ type: 'cmd:reg', payload: name });
  }

  getCommandEvt(): Observable<Event> {
    return this.commandEvt$.asObservable();
  }

  exec<T extends any>(
    name: string,
    payload?: any,
    type?: ExecType,
    ctx?: object,
  ): Observable<T> {
    if (!this.commands.has(name)) {
      const cases = {
        [ExecType.ignore]: ignore,
        [ExecType.wait]: this.wait.bind(this),
      };

      return switchcase(cases)(this.error.bind(this))(type)(
        name,
        payload,
        type,
        ctx,
      );
    }

    const [fn, origCtx] = this.commands.get(name) as Command;
    let result$: T | Observable<T>;

    try {
      result$ =
        !ctx && !origCtx ? fn(payload) : fn.call(ctx || origCtx, payload);
    } catch (err) {
      result$ = throwError(err);
    }

    this.commandEvt$.next({ type: 'cmd:exec', payload: name });
    return !result$ ? EMPTY : isObservable(result$) ? result$ : of(result$);
  }

  private wait<T>(
    name: string,
    payload: any,
    type: ExecType,
    ctx: object,
  ): Observable<T | any> {
    return this.commandEvt$.pipe(
      filter(event => event.type === 'cmd:reg' && event.payload === name),
      switchMap(() => this.exec(name, payload, type, ctx)),
    );
  }

  private error(name: string): Observable<never> {
    const msg = `Command '${name}' was not found`;
    this.commands.has('err') ? this.exec('err', msg) : console.error(msg);
    return throwError(msg);
  }
}
