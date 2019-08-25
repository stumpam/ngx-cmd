import { async, TestBed } from '@angular/core/testing';
import { NgxCmdModule } from './ngx-cmd.module';

describe('NgxCmdModule', () => {
  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxCmdModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxCmdModule).toBeDefined();
  });
});
