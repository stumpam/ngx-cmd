import { Injectable } from '@angular/core';
import { get as _get, omit as _omit, setWith as _setWith } from 'lodash-es';
import { merge, Observable, Subject } from 'rxjs';
import { filter, finalize, pluck, share } from 'rxjs/operators';

import { CommandService } from './command.service';
import { Event, EventType, StoreReducer } from './events.interface';
import { err, EventsService } from './events.service';

// tslint:disable-next-line: no-empty-interface
export interface Store {}

let storeß: StoreService;

export const getFromStore = (path: string) => storeß.get(path);

export const select = (path: string) => storeß.select(path);

export const dispatch = (event: string) => storeß.dispatch(event);

export const regReducer = (
  event: 'string',
  path: string,
  reducer: string | string | ((state: any) => any),
  type: EventType = EventType['store.dispatch'],
) => storeß.registerReducer(event, path, reducer, type);

export const unRegReducer = (
  event: string,
  type: EventType = EventType['store.dispatch'],
) => storeß.unregisterReducer(event, type);

let init = true;

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly store: Store = {};
  private readonly storeEvents$ = new Subject<Event>();
  private subs: Record<string, Observable<Event>> = {};
  private readonly events$ = merge(
    this.storeEvents$.pipe(filter(evt => evt.type.startsWith('str.dsp'))),
    this.cmd.getCommandEvts$(),
    this.evtß.getEvents$(),
  );
  private reducers: Record<string, StoreReducer> = {};

  constructor(
    private readonly cmd: CommandService,
    private readonly evtß: EventsService,
  ) {
    storeß = this;
  }

  get(path: string) {
    return _get(this.store, path);
  }

  processReducers() {
    this.events$.subscribe(evt => {
      const obj = this.reducers[evt.type];
      if (!obj) return;

      const fn =
        typeof obj.reducer === 'string'
          ? this.cmd.getCmd(obj.reducer)
          : obj.reducer;

      this.set(obj.path, fn(this.get(obj.path)));
    });
  }

  registerReducer(
    event: string,
    path: string,
    reducer: string | ((state: any) => any),
    type: EventType = EventType['store.dispatch'],
  ) {
    const typedEvent = `${type}:${event}`;

    if (init) {
      this.processReducers();
      init = false;
    }

    this.reducers[typedEvent] = {
      path,
      reducer,
    };
  }

  unregisterReducer(
    event: string,
    type: EventType = EventType['store.dispatch'],
  ) {
    if (!this.reducers[`${type}:${event}`]) {
      err(`[Store] Unable to unregister reducer: ${type}:${event}`);
    }

    this.reducers = _omit(this.reducers, `${type}:${event}`);
  }

  select(name: string) {
    if (!this.subs[name]) {
      this.subs[name] = this.storeEvents$.pipe(
        filter(event => event.type === `str:${name}`),
        pluck('payload'),
        finalize(() => (this.subs = _omit(this.subs, name))),
        share(),
      );
    }

    return this.subs[name];
  }

  dispatch(event: string) {
    this.storeEvents$.next({ type: `store.dispatch:${event}` });
  }

  set(path: string, payload: any) {
    if (path === '') return err('[Store] Path can not be empty!');

    _setWith(this.store, path, payload, Object);
    this.storeEvents$.next({ type: `store:${path}`, payload });
  }

  clear(path: string) {
    _omit(this.store, path);

    this.storeEvents$.next({ type: `store.clear:${path}` });
  }
}
