import { Injectable } from '@angular/core';
import { get as _get, omit as _omit, setWith as _setWith } from 'lodash-es';
import { merge, Observable, Subject } from 'rxjs';
import { filter, finalize, pluck, share } from 'rxjs/operators';

import { CommandService } from './command.service';
import { Event, EventType, StoreReducer } from './events.interface';
import { err, EventsService } from './events.service';

declare global {
  // tslint:disable-next-line: no-empty-interface
  export interface Store {}
}

let storeß: StoreService;

export const getFromStore = (path: string) => storeß.get(path);

export const select = (path: string) => storeß.select(path);

export const dispatch = (event: string) => storeß.dispatch(event);

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
  private reducers: Record<string, StoreReducer[]> = {};

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

      obj.forEach(red => {
        const fn =
          typeof red.reducer === 'string'
            ? this.cmd.getCmd(red.reducer)
            : red.reducer;

        this.set(red.path, fn(this.get(red.path)));
      });
    });
  }

  registerReducer(
    event: string,
    path: string,
    reducer: string | ((state: any) => any),
    name?: string,
    type: EventType = EventType['store.dispatch'],
  ) {
    const typedEvent = `${type}:${event}`;
    if (!this.reducers[typedEvent]) {
      this.reducers[typedEvent] = [];
    }

    this.reducers[typedEvent] = [
      ...this.reducers[typedEvent],
      {
        path,
        reducer,
        name,
      },
    ];
  }

  unregisterReducer(
    event: string,
    name: string,
    type: EventType = EventType['store.dispatch'],
  ) {
    let reducers = this.reducers[`${type}:${event}`];

    if (!reducers) err(`[Store] Unable to unregister reducer: ${name}`);

    reducers = reducers.filter(red => red.name !== name);
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
