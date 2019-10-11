export { NgxCmdModule } from './lib/ngx-cmd.module';
export {
  CommandService,
  ExecType,
  cmd,
  cmdSync,
  cmdWait,
  cmdIgnore,
  regCmd,
  regManyCmd,
  CommandObject,
} from './lib/command.service';
export {
  StoreService,
  dispatch,
  getFromStore,
  select,
  store,
  regReducer,
  unRegReducer,
} from './lib/store.service';
export {
  EventsService,
  err,
  log,
  warn,
  onEvt,
  evt,
  getEvts,
} from './lib/events.service';
export { Event, Evt, EventType, StoreReducer } from './lib/events.interface';
