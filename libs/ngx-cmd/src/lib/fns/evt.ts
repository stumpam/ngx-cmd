import { Injector } from '@angular/core';

import { Event } from '../events.interface';
import { EventsService } from '../events.service';

export const evtEmpty = (inj: Injector) => {
  const evt = inj.get<EventsService>(EventsService);
  return (event: Event | string, payload?: any) =>
    evt.emit(event as any, payload);
};

export const errEmpty = (inj: Injector) => {
  const evt = inj.get<EventsService>(EventsService);
  return (payload: any) =>
    evt.emit('err', payload);
};

export const logEmpty = (inj: Injector) => {
  const evt = inj.get<EventsService>(EventsService);
  return (payload: any) =>
    evt.emit('log', payload);
};

export const warnEmpty = (inj: Injector) => {
  const evt = inj.get<EventsService>(EventsService);
  return (payload: any) =>
    evt.emit('warn', payload);
};
