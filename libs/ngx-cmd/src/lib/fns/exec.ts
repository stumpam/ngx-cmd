import { Injector } from '@angular/core';

import { CommandService, ExecType } from '../command.service';

export const execEmpty = (inj: Injector) => {
  const cmd = inj.get<CommandService>(CommandService);
  return <T>(name: string, payload?: any, type?: ExecType, ctx?: object) => {
    return cmd.exec<T>(name, payload, type, ctx);
  };
};

export const execWaitEmpty = (inj: Injector) => {
  const cmd = inj.get<CommandService>(CommandService);
  return <T>(name: string, payload?: any, ctx?: object) => {
    return cmd.exec<T>(name, payload, ExecType.wait, ctx);
  };
};

export const execIgnoreEmpty = (inj: Injector) => {
  const cmd = inj.get<CommandService>(CommandService);
  return <T>(name: string, payload?: any, ctx?: object) => {
    return cmd.exec<T>(name, payload, ExecType.ignore, ctx);
  };
};
