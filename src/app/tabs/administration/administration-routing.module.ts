import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrationPage } from './administration.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrationPage,
    children: [
      {
        path: '',
        loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./modify-user/modify-user.module').then( m => m.ModifyUserPageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./modify-product/modify-product.module').then( m => m.ModifyProductPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationPageRoutingModule {}
