import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgxCmdModule } from '@stumar/ngx-cmd';

import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'test',
        loadChildren: () =>
          import('./second/second.module').then(m => m.SecondModule)
      }
    ]
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxCmdModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
