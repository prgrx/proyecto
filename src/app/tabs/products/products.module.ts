import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsPage } from './products.page';
import { ProductPage } from './product/product.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { ProductsPageRoutingModule } from './products-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ProductsPage }]),
    ProductsPageRoutingModule,
  ],
  declarations: [
    ProductsPage,
    ProductPage
  ]
})
export class ProductsPageModule {}
