import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationGuard } from 'src/shared/guards/administration.guard';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../tabs/profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'user/:id',
        loadChildren: () => import('./profile/id/id.module').then(m => m.IdPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () => import('./messages/messages.module').then(m => m.MessagesPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            loadChildren: () => import('./messages/message/message.module').then(m => m.MessagePageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadChildren: () => import('../tabs/products/products.module').then(m => m.ProductsPageModule),
            canActivate: [AuthGuard]
          },
          {
            path: ':id',
            loadChildren: () => import('./products/modal-show/modal-show.module').then(m => m.ModalShowPageModule),
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'finder',
        loadChildren: () => import('./finder/finder.module').then(m => m.FinderPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'housing',
        loadChildren: () => import('./housing/housing.module').then(m => m.HousingPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then( m => m.AdministrationPageModule),
        canActivate: [AdministrationGuard]
        //canActivate: [AuthGuard, AdministrationGuard]
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
