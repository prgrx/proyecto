import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('../tabs/perfil/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'mensajes',
        loadChildren: () => import('../tabs/mensajes/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'productos',
        loadChildren: () => import('../tabs/productos/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'buscador',
        loadChildren: () => import('../tabs/buscador/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'vivienda',
        loadChildren: () => import('../tabs/vivienda/tab5.module').then(m => m.Tab5PageModule)
      },
      {
        path: '',
        redirectTo: '/app/perfil',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/perfil',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
