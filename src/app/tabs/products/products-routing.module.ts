import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
  },
  {
    path: 'modal-create',
    loadChildren: () => import('./modal-create/modal-create.module').then( m => m.ModalCreatePageModule)
  },
  {
    path: 'modal-show',
    loadChildren: () => import('./modal-show/modal-show.module').then( m => m.ModalShowPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsPageRoutingModule {}
