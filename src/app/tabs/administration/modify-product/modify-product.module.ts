import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/shared/pipes/pipes.module';

import { ModifyProductPageRoutingModule } from './modify-product-routing.module';

import { ModifyProductPage } from './modify-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    ModifyProductPageRoutingModule
  ],
  declarations: [ModifyProductPage]
})
export class ModifyProductPageModule {}
