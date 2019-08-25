import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EventsService } from '../events.service';
import { evtEmpty } from './evt';

let service: EventsService;

describe('CommandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EventsService);
  });

  it('should send event', done => {
    const evt = evtEmpty(TestBed.get(Injector));

    service.getEvents$().subscribe(data => {
      expect(data.type).toBe('evt:test');
      done();
    });

    evt('test');
  });

  it('should send event with payload', done => {
    const evt = evtEmpty(TestBed.get(Injector));

    service.getEvents$().subscribe(data => {
      expect(data.type).toBe('evt:test');
      expect(data.payload).toEqual({ abc: 'cde' });
      done();
    });

    evt('test', { abc: 'cde' });
  });
});
