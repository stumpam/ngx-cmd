import { Injector } from '@angular/core';
import { throwError } from 'rxjs';

import { Event } from '../events.interface';
import { EventsService } from '../events.service';

export const evtEmpty = (inj: Injector) => {
  const evt = inj && inj.get<EventsService>(EventsService);
  const msg = 'Events service was not found';
  return (event: Event | string, payload?: any) =>
    evt
      ? evt.emit(event as any, payload)
      : (console.error(msg), throwError(msg));
};

export const errEmpty = (inj: Injector) => {
  const evt = inj && inj.get<EventsService>(EventsService);
  const msg = 'Events service was not found';
  return (payload: any) =>
    evt ? evt.emit('err', payload) : (console.error(msg), throwError(msg));
};

export const logEmpty = (inj: Injector) => {
  const evt = inj && inj.get<EventsService>(EventsService);
  const msg = 'Events service was not found';
  return (payload: any) =>
    evt ? evt.emit('log', payload) : (console.error(msg), throwError(msg));
};

export const warnEmpty = (inj: Injector) => {
  const evt = inj && inj.get<EventsService>(EventsService);
  const msg = 'Events service was not found';
  return (payload: any) =>
    evt ? evt.emit('warn', payload) : (console.error(msg), throwError(msg));
};
