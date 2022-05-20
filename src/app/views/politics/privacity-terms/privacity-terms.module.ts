import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacityTermsPageRoutingModule } from './privacity-terms-routing.module';

import { PrivacityTermsPage } from './privacity-terms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacityTermsPageRoutingModule
  ],
  declarations: [PrivacityTermsPage]
})
export class PrivacityTermsPageModule {}
