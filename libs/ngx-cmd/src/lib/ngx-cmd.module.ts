import { Injector, NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule()
export class NgxCmdModule {
  constructor(
    private readonly injector: Injector,
    @Optional() @SkipSelf() parentModule: NgxCmdModule,
  ) {
    if (parentModule) {
      throw new Error(
        'NgCmdModule is already loaded. Import it in the AppModule only',
      );
    }
  }
}
