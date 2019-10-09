export { NgxCmdModule } from './lib/ngx-cmd.module';
export {
  CommandService,
  ExecType,
  cmd,
  cmdWait,
  cmdIgnore,
  regCmd,
  regManyCmd,
  Cmd,
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
