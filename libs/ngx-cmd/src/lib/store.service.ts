import { Injectable } from '@angular/core';
import { defer, isObservable, merge, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  pluck,
  share,
  startWith,
} from 'rxjs/operators';

import { CommandService } from './command.service';
import { Event, EventType, StoreReducer } from './events.interface';
import { err, EventsService } from './events.service';
import { get, omit, set } from './fns';

// tslint:disable-next-line: no-empty-interface
export interface Store {}

let storeß: StoreService;

export const getFromStore = (path: string) => storeß.get(path);

export const select = (path: string) => storeß.select(path);

export const dispatch = (event: string) => storeß.dispatch(event);

export const regReducer = (
  event: string,
  path: string,
  reducer: string | string | ((state: any) => any),
  type: EventType = EventType['store.dispatch'],
) => storeß.registerReducer(event, path, reducer, type);

export const unRegReducer = (
  event: string,
  type: EventType = EventType['store.dispatch'],
) => storeß.unregisterReducer(event, type);

export const store = (path: string, value: any) => storeß.set(path, value);

export const onStore = () => storeß.getStoreEvents$();

const doOnSubscribe = <T>(onSubscribe: () => any) => (source$: Observable<T>) =>
  defer(() => {
    const data = onSubscribe();
    return data ? source$.pipe(startWith(data)) : source$;
  });

let init = true;

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly store: Store = {};
  private readonly storeEvents$ = new Subject<Event>();
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

  getStoreEvents$() {
    return this.storeEvents$.asObservable();
  }

  get(path: string) {
    return get(path, this.store);
  }

  processReducers() {
    this.events$.subscribe((evt: Event) => {
      //TODO: change to pipe filter
      const obj = this.reducers[evt.type];
      if (!obj) return;

      const fn =
        typeof obj.reducer === 'string'
          ? this.cmd.getCmd(obj.reducer)
          : obj.reducer;

      const result = fn([this.get(obj.path), evt.payload]);
      //TODO: Change whole fn to observable
      if (isObservable(result)) {
        result.subscribe(data => this.set(obj.path, data));
      } else {
        this.set(obj.path, result);
      }
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

    this.reducers = omit(`${type}:${event}`, this.reducers);
  }

  select(name: string) {
    return this.storeEvents$.pipe(
      filter(event => event.type === `store:${name}`),
      pluck('payload'),
      doOnSubscribe(() => this.get(name)),
      share(),
      distinctUntilChanged(),
    );
  }

  dispatch(event: string) {
    this.storeEvents$.next({ type: `store.dispatch:${event}` });
  }

  set(path: string, payload: any) {
    if (path === '') return err('[Store] Path can not be empty!');

    set(path, this.store, payload);
    this.storeEvents$.next({ type: `store:${path}`, payload });
  }

  clear(path: string) {
    omit(path, this.store);

    this.storeEvents$.next({ type: `store.clear:${path}` });
  }
}
