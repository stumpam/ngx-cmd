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
  [key: string]: (...args: any[]) => any;
}

type Command = [(...args: any) => any, object | undefined];

const ignore = (): Observable<never> => EMPTY;

let cmdß: CommandService | undefined;

export const cmd: Cmd = <T>(name: string, payload?: any, type?: ExecType) =>
  cmdß.exec<T>(name, payload, type);

export const cmdWait: Cmd = <T>(name: string, payload?: any): Observable<T> =>
  cmdß.exec<T>(name, payload, ExecType.wait);

export const cmdIgnore: Cmd = <T>(name: string, payload?: any): Observable<T> =>
  cmdß.exec<T>(name, payload, ExecType.ignore);

export const regCmd = (name: string, fn: (...args: any) => any) =>
  cmdß.registerCommand(name, fn);

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private commands: CommandStore = {};
  private readonly commandEvt$ = new Subject<Event>();

  constructor() {
    cmdß = this;
  }

  registerCommand(name: string, fn: (...args: any) => any): void {
    if (this.commands[name]) {
      this.exec('err', `Command ${name} already exists`);
    }

    this.commands = { ...this.commands, [name]: fn };
    this.commandEvt$.next({ type: 'cmd:reg', payload: name });
  }

  getCommandEvt(): Observable<Event> {
    return this.commandEvt$.asObservable();
  }

  exec<T extends any>(
    name: string,
    payload?: any,
    type?: ExecType,
  ): Observable<T> {
    if (
      this.commands[name] === undefined ||
      typeof this.commands[name] !== 'function'
    ) {
      const cases = {
        [ExecType.ignore]: ignore,
        [ExecType.wait]: this.wait.bind(this),
      };

      return switchcase(cases)(this.error.bind(this))(type)(
        name,
        payload,
        type,
      );
    }

    let result$: T | Observable<T>;

    try {
      result$ = this.commands[name](payload);
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
  ): Observable<T | any> {
    return this.commandEvt$.pipe(
      filter(event => event.type === 'cmd:reg' && event.payload === name),
      switchMap(() => this.exec(name, payload, type)),
    );
  }

  private error(name: string): Observable<never> {
    const msg = `Command '${name}' was not found`;
    this.commands.err ? this.exec('err', msg) : console.error(msg);
    return throwError(msg);
  }

  unregisterCommand(name: string) {
    if (!this.commands[name]) {
      this.exec('err', `Command '${name}' was not found`);
    }
    const { [name]: _, ...commands } = this.commands;

    this.commands = commands;
  }
}
