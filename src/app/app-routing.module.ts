import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { NoLoginGuard } from 'src/shared/guards/no-login.guard';

const routes: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule),
    //canActivate: [NoLoginGuard]
  },
  {
    path: 'cookies',
    loadChildren: () => import('./views/politics/cookies/cookies.module').then( m => m.CookiesPageModule)
  },
  {
    path: 'privacity-terms',
    loadChildren: () => import('./views/politics/privacity-terms/privacity-terms.module').then( m => m.PrivacityTermsPageModule)
  },
  {
    path: 'banned',
    loadChildren: () => import('./views/banned/banned.module').then( m => m.BannedPageModule)
  },
  {
    path: '404NotFound',
    loadChildren: () => import('./views/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: '**',
    redirectTo: '404NotFound',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
