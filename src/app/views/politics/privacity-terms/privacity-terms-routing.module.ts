import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacityTermsPage } from './privacity-terms.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacityTermsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacityTermsPageRoutingModule {}
