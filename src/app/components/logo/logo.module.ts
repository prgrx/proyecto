import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/shared/pipes/pipes.module';
import { LogoComponent } from './logo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [LogoComponent],
  exports: [LogoComponent]
})
export class LogoModule {}