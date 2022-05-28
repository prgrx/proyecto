import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdPageRoutingModule } from './id-routing.module';

import { IdPage } from './id.page';
import { VerificationTagComponentModule } from 'src/app/components/verification-tag/verification-tag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdPageRoutingModule,
    VerificationTagComponentModule
  ],
  declarations: [IdPage]
})
export class IdPageModule {}
