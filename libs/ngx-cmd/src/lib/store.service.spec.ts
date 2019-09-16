import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.service';

describe('StoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StoreService = TestBed.get(StoreService);
    expect(service).toBeTruthy();
  });

  it('should select data static', () => {
    const service: StoreService = TestBed.get(StoreService);
    service.set('abc.def', 'abc');

    expect(service.get('abc.def')).toEqual('abc');
  });

  it('should select data dynamic', done => {
    const service: StoreService = TestBed.get(StoreService);
    service.set('abc.def', 'abc');

    service.select('abc.def').subscribe(data => {
      expect(data).toEqual('abc');
      done();
    });
  });

  it('should select data dynamic later', () => {
    const service: StoreService = TestBed.get(StoreService);

    const result = {
      f_abc: 0,
      f_def: 0,
      s_abc: 0,
      s_def: 0,
      t_abc: 0,
      t_def: 0,
    };

    service.select('abc.def').subscribe(data => {
      if (data === 'abc') {
        result.f_abc++;
      }
      if (data === 'def') {
        result.f_def++;
      }
    });

    service.set('abc.def', 'abc');

    service.select('abc.def').subscribe(data => {
      if (data === 'abc') {
        result.s_abc++;
      }
      if (data === 'def') {
        result.s_def++;
      }
    });

    service.set('abc.def', 'def');

    service.select('abc.def').subscribe(data => {
      if (data === 'abc') {
        result.t_abc++;
      }
      if (data === 'def') {
        result.t_def++;
      }
    });

    expect(result).toEqual({
      f_abc: 1,
      f_def: 1,
      s_abc: 1,
      s_def: 1,
      t_abc: 0,
      t_def: 1,
    });
  });
});
