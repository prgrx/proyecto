import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCreatePageRoutingModule } from './modal-create-routing.module';

import { ModalCreatePage } from './modal-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCreatePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalCreatePage]
})
export class ModalCreatePageModule {}
