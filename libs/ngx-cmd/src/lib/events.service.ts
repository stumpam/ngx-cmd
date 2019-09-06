import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CommandService } from './command.service';
import {
  Error,
  ErrPayload,
  Event,
  Evt,
  Log,
  LogPayload,
  Warn,
  WarnPayload,
} from './events.interface';

export let evtß: EventsService | undefined;

export const evt: Evt = (event: Event | string, payload?: any) =>
  evtß.emit(event as any, payload);

export const err = (payload: any) => evtß.emit('err', payload);

export const log = (payload: any) => evtß.emit('log', payload);

export const warn = (payload: any) => evtß.emit('warn', payload);

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly events$ = new Subject<Event>();

  constructor(private readonly cmd: CommandService) {
    evtß = this;
    cmd.registerCommand('err', this.err.bind(this));
    cmd.registerCommand('warn', this.warn.bind(this));
    cmd.registerCommand('emit', this.emit.bind(this));
  }

  getEvents$(): Observable<Event> {
    return this.events$.asObservable();
  }

  emit(name: string, payload?: any): void;
  emit(name: Event): void;
  emit(event: Event | string, payload?: any): void {
    const msg: Event =
      typeof event === 'string'
        ? { type: `evt:${event}`, ...(payload && { payload }) }
        : { type: `evt:${event.type}`, payload: event.payload };
    this.events$.next(msg);
  }

  log(payload: LogPayload): void {
    const msg: Log = { type: 'evt:log', payload };
    console.log('evt:log', msg);
    this.events$.next(msg);
  }

  err(payload: ErrPayload): void {
    const msg: Error = { type: 'evt:err', payload };
    console.error('evt:err', msg);
    this.events$.next(msg);
  }

  warn(payload: WarnPayload): void {
    const msg: Warn = { type: 'evt:warn', payload };
    console.warn('evt:warn', msg);
    this.events$.next(msg);
  }
}
