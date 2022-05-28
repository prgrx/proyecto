import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministrationPageRoutingModule } from './administration-routing.module';
import { LogoModule } from 'src/app/components/logo/logo.module';
import { AdministrationPage } from './administration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrationPageRoutingModule,
    LogoModule
  ],
  declarations: [AdministrationPage]
})
export class AdministrationPageModule {}
