import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CommandService } from './command.service';
import {
  Error,
  ErrPayload,
  Event,
  Warn,
  WarnPayload,
  Log,
  LogPayload
} from './events.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly events$ = new Subject<Event>();

  constructor(private readonly cmd: CommandService) {
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

  log(log: LogPayload): void {
    const msg: Log = { type: 'evt:log', payload: log };
    console.log('evt:log', msg);
    this.events$.next(msg);
  }

  err(err: ErrPayload): void {
    const msg: Error = { type: 'evt:err', payload: err };
    console.error('evt:err', msg);
    this.events$.next(msg);
  }

  warn(err: WarnPayload): void {
    const msg: Warn = { type: 'evt:warn', payload: err };
    console.warn('evt:warn', msg);
    this.events$.next(msg);
  }
}
