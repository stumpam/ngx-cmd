import { Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { CommandService, ExecType } from '../command.service';

export const execEmpty = (inj: Injector) => {
  const cmd = inj && inj.get<CommandService>(CommandService);
  const msg = 'Command service was not found';
  return <T>(
    name: string,
    payload?: any,
    type?: ExecType,
    ctx?: object
  ): Observable<T> =>
    cmd
      ? cmd.exec<T>(name, payload, type, ctx)
      : (console.error(msg), throwError(msg));
};

export const execWaitEmpty = (inj: Injector) => {
  const cmd = inj && inj.get<CommandService>(CommandService);
  const msg = 'Command service was not found';
  return <T>(name: string, payload?: any, ctx?: object): Observable<T> =>
    cmd
      ? cmd.exec<T>(name, payload, ExecType.wait, ctx)
      : (console.error(msg), throwError(msg));
};

export const execIgnoreEmpty = (inj: Injector) => {
  const cmd = inj && inj.get<CommandService>(CommandService);
  const msg = 'Command service was not found';
  return <T>(name: string, payload?: any, ctx?: object): Observable<T> =>
    cmd
      ? cmd.exec<T>(name, payload, ExecType.ignore, ctx)
      : (console.error(msg), throwError(msg));
};
