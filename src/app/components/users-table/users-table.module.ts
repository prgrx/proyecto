import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/shared/pipes/pipes.module';
import { UsersTableComponent } from './users-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule
  ],
  declarations: [UsersTableComponent],
  exports: [UsersTableComponent]
})
export class UsersTableModule {}