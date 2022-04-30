import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalShowPageRoutingModule } from './modal-show-routing.module';

import { ModalShowPage } from './modal-show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalShowPageRoutingModule
  ],
  declarations: [ModalShowPage]
})
export class ModalShowPageModule {}
