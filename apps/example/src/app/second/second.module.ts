import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TestComponent } from './test/test.component';

const routes = [{ path: '', component: TestComponent }];

@NgModule({
  declarations: [TestComponent],
  imports: [RouterModule.forChild(routes), CommonModule]
})
export class SecondModule {}
