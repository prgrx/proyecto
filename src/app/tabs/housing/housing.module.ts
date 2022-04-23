import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousingPage } from './housing.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { HousingPageRoutingModule } from './housing-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: HousingPage }]),
    HousingPageRoutingModule,
  ],
  declarations: [HousingPage]
})
export class HousingPageModule {}
