import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousingPage } from './housing.page';

const routes: Routes = [
  {
    path: '',
    component: HousingPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingPageRoutingModule {}
