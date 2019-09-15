export interface Event {
  type: string;
  payload?: any;
}

export interface Evt {
  (name: string, payload?: any): void;
  (name: Event): void;
}

export interface Error {
  type: 'evt:err';
  payload?: ErrPayload;
}

export type ErrPayload = any;

export interface Log {
  type: 'evt:log';
  payload?: LogPayload;
}

export type LogPayload = any;

export interface Warn {
  type: 'evt:warn';
  payload?: WarnPayload;
}

export type WarnPayload = any;

export enum EventType {
  event = 'evt',
  command = 'cmd',
  store = 'store',
  'store.clear' = 'store.clear',
  'store.dispatch' = 'store.dispatch',
}

export interface StoreReducer {
  path: string;
  reducer: ((state: any) => any) | string;
  name?: string;
}
