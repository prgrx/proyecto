import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyUserPageRoutingModule } from './modify-user-routing.module';

import { ModifyUserPage } from './modify-user.page';
import { UsersTableModule } from '../../../components/users-table/users-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyUserPageRoutingModule,
    UsersTableModule
  ],
  declarations: [ModifyUserPage]
})
export class ModifyUserPageModule {}
