import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinderPage } from './finder.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { FinderPageRoutingModule } from './finder-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: FinderPage }]),
    FinderPageRoutingModule,
  ],
  declarations: [FinderPage]
})
export class FinderPageModule {}
