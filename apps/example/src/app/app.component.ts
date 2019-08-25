import { Component } from '@angular/core';
import { regCmd, cmd } from '@stumar/ngx-cmd';
import { Observable } from 'rxjs';

declare global {
  interface Cmd {
    // tslint:disable-next-line: callable-types
    (name: 'test'): Observable<never>;
  }
}

@Component({
  selector: 'example-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'example';

  constructor() {
    regCmd('test', () => console.log('run'));
    cmd('test').subscribe({complete: () => console.log('data: ')});
  }
}
