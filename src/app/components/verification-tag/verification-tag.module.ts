import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationTagComponent } from './verification-tag.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [VerificationTagComponent],
  exports: [VerificationTagComponent]
})
export class VerificationTagComponentModule {}
