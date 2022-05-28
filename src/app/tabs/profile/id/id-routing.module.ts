import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdPage } from './id.page';

const routes: Routes = [
  {
    path: '',
    component: IdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdPageRoutingModule {}
