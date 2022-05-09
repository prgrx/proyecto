import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagePageRoutingModule } from './message-routing.module';

import { MessagePage } from './message.page';
import { PipesModule } from 'src/shared/pipes/pipes.module';
import { DomChangeDirective } from 'src/shared/directives/dom-change.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MessagePageRoutingModule,
    PipesModule,
  ],
  declarations: [
    MessagePage,
    DomChangeDirective
  ]
})
export class MessagePageModule {}
