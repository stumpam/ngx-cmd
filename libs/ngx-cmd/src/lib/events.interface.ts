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
