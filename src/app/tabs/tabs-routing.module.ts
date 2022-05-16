import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../tabs/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            loadChildren: () => import('./messages/messages.module').then(m => m.MessagesPageModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./messages/message/message.module').then(m => m.MessagePageModule)
          }
        ]
      },
      {
        path: 'products',
        loadChildren: () => import('../tabs/products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'finder',
        loadChildren: () => import('./finder/finder.module').then(m => m.FinderPageModule)
      },
      {
        path: 'housing',
        loadChildren: () => import('./housing/housing.module').then(m => m.HousingPageModule)
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
