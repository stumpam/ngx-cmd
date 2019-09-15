import { TestBed } from '@angular/core/testing';

import { EventsService } from './events.service';

describe('EventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsService = TestBed.get(EventsService);
    expect(service).toBeTruthy();
  });

  it('should return same instance', () => {
    const service: EventsService = TestBed.get(EventsService);

    const x = service.onEvt('abc');
    const y = service.onEvt('abc');

    expect(x).toEqual(y);

  });

  it('should clear sub', () => {
    const service: EventsService = TestBed.get(EventsService);

    expect(service['subs']['abc']).toBeUndefined();

    const x = service.onEvt('abc').subscribe();
    const y = service.onEvt('abc').subscribe();

    x.unsubscribe();
    y.unsubscribe();

    expect(service['subs']).toEqual({});

  });
});
