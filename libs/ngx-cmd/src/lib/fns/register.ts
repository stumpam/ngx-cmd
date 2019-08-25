import { Injector } from '@angular/core';

import { CommandService } from '../command.service';

export const registerEmpty = (inj: Injector) => {
  const cmd = inj.get<CommandService>(CommandService);
  return (name: string, fn: (...args: any) => any, ctx?: object) =>
    cmd
      ? cmd.registerCommand(name, fn, ctx)
      : console.error('Command service was not found');
};
