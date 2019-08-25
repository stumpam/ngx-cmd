import { Injector, NgModule, Optional, SkipSelf } from '@angular/core';

import {
  execEmpty,
  execIgnoreEmpty,
  execWaitEmpty,
  registerEmpty
} from './fns';
import { errEmpty, evtEmpty, logEmpty, warnEmpty } from './fns/evt';

declare global {
  // tslint:disable-next-line: no-empty-interface
  export interface Cmd {
    // <T>(name: string, payload?: any, ctx?: object): Observable<T>;
  }
}

export let exec: Cmd;
export let cmd: Cmd;
export let execWait: Cmd;
export let cmdWait: Cmd;
export let execIgnore: Cmd;
export let cmdIgnore: Cmd;

export let regCmd: (
  name: string,
  fn: (...args: any) => any,
  ctx?: object
) => void;

interface Evt {
  (name: string, payload?: any): void;
  (name: Event): void;
}

export let evt: Evt;
export let err: (err: string) => void;
export let warn: (warn: string) => void;
export let log: (log: string) => void;

@NgModule()
export class NgxCmdModule {
  constructor(
    private readonly injector: Injector,
    @Optional() @SkipSelf() parentModule: NgxCmdModule
  ) {
    if (parentModule) {
      throw new Error(
        'NgCmdModule is already loaded. Import it in the AppModule only'
      );
    }
    exec = execEmpty(injector);
    cmd = exec;
    execWait = execWaitEmpty(injector);
    cmdWait = execWait;
    execIgnore = execIgnoreEmpty(injector);
    cmdIgnore = execIgnore;
    regCmd = registerEmpty(injector);
    evt = evtEmpty(injector);
    err = errEmpty(injector);
    warn = warnEmpty(injector);
    log = logEmpty(injector);
  }
}
