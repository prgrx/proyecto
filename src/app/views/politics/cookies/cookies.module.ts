import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CookiesPageRoutingModule } from './cookies-routing.module';

import { CookiesPage } from './cookies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CookiesPageRoutingModule
  ],
  declarations: [CookiesPage]
})
export class CookiesPageModule {}
