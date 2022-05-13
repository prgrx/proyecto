import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalShowPageRoutingModule } from './modal-show-routing.module';

import { ModalShowPage } from './modal-show.page';
import { CommentsPage } from './comments/comments.page';
import { PipesModule } from 'src/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalShowPageRoutingModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [ModalShowPage, CommentsPage]
})
export class ModalShowPageModule {}
