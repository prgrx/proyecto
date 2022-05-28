import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinderPage } from './finder.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { FinderPageRoutingModule } from './finder-routing.module';
import { PipesModule } from 'src/shared/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: FinderPage }]),
    FinderPageRoutingModule,
    PipesModule
  ],
  declarations: [FinderPage]
})
export class FinderPageModule {}
