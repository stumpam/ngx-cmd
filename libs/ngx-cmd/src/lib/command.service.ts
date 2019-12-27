import { Injectable } from '@angular/core';
import { EMPTY, isObservable, Observable, of, Subject, throwError } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Event } from './events.interface';
import { err } from './events.service';
import { switchcase } from './fns';

export const enum ExecType {
  'ignore',
  'wait',
}

declare global {
  // tslint:disable-next-line: no-empty-interface
  interface Cmd {
    // <T>(name: string, payload?: any): Observable<T>;
  }
}

declare global {
  // tslint:disable-next-line: no-empty-interface
  interface CmdSync {
    // <T>(name: string, payload?: any): Observable<T>;
  }
}

interface CommandStore {
  [key: string]: (...args: any[]) => any;
}

export type CommandObject = CommandStore;

type Command = [(...args: any) => any, object | undefined];

const ignore = (): Observable<never> => EMPTY;

let cmdß: CommandService | undefined;

export const cmd: Cmd = (name: string, payload?: any, type?: ExecType) =>
  cmdß.exec(name, payload, type);

export const cmdSync: CmdSync = (
  name: string,
  payload?: any,
  type?: ExecType,
) => cmdß.exec(name, payload, type, true);

export const cmdWait: Cmd = (name: string, payload?: any) =>
  cmdß.exec(name, payload, ExecType.wait);

export const cmdIgnore: Cmd = (name: string, payload?: any) =>
  cmdß.exec(name, payload, ExecType.ignore);

export const regCmd = (name: string, fn: (...args: any) => any) =>
  cmdß.registerCommand(name, fn);

export const regManyCmd = (scope: string, cmds: CommandObject) =>
  cmdß.registerManyCommands(scope, cmds);

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
      err(`Command ${name} already exists`);
    }

    this.commands = { ...this.commands, [name]: fn };
    this.commandEvt$.next({ type: 'cmd:reg', payload: name });
  }

  registerManyCommands(scope: string, store: CommandStore) {
    Object.keys(store).forEach(key => {
      this.registerCommand(`${scope}.${key}`, store[key]);
    });
  }

  getCommandEvts$(): Observable<Event> {
    return this.commandEvt$.asObservable();
  }

  exec<T extends any>(
    name: string,
    payload?: any,
    type?: ExecType,
    sync = false,
  ): Observable<T> | T {
    if (
      this.commands[name] === undefined ||
      typeof this.commands[name] !== 'function'
    ) {
      const cases = {
        [ExecType.ignore]: ignore,
        [ExecType.wait]: this.wait.bind(this),
      };

      if (!(type + 1)) sync = true;

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
    return !result$
      ? EMPTY
      : isObservable(result$)
      ? result$
      : sync
      ? result$
      : of(result$);
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

  getCmd(name: string) {
    return this.commands[name];
  }

  private error(name: string): Observable<never> {
    const msg = `Command '${name}' was not found`;
    err(msg);
    return throwError(msg);
  }

  unregisterCommand(name: string) {
    if (!this.commands[name]) {
      this.exec('err', `Command '${name}' was not found`);
    }
    const { [name]: _, ...commands } = this.commands;

    this.commands = commands;
    this.commandEvt$.next({ type: 'cmd:unreg', payload: name });
  }
}
