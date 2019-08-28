import { Component, OnInit } from '@angular/core';
import { cmd } from '@stumpam/ngx-cmd';

@Component({
  selector: 'example-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    cmd('test');
  }
}
