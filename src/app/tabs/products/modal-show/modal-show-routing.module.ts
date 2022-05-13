import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalShowPage } from './modal-show.page';

const routes: Routes = [
  {
    path: '',
    component: ModalShowPage
  },
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalShowPageRoutingModule {}
