import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesPage } from './messages.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { MessagesPageRoutingModule } from './messages-routing.module';
import { PipesModule } from 'src/shared/pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MessagesPageRoutingModule,
    PipesModule
  ],
  declarations: [
    MessagesPage,
  ]
})
export class MessagesPageModule {}
