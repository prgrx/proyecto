import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalRegisterPageRoutingModule } from './modal-register-routing.module';

import { ModalRegisterPage } from './modal-register.page';
import { LogoModule } from 'src/app/components/logo/logo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRegisterPageRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    LogoModule
  ],
  declarations: [ModalRegisterPage]
})
export class ModalRegisterPageModule {}
