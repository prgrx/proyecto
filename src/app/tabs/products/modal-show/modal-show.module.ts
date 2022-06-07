import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; 
import { ModalShowPageRoutingModule } from './modal-show-routing.module';

import { ModalShowPage } from './modal-show.page';
import { CommentsPage } from './comments/comments.page';
import { PipesModule } from 'src/shared/pipes/pipes.module';
import { VerificationTagComponentModule } from 'src/app/components/verification-tag/verification-tag.module';
import { ImageViewerModule } from "ngx-image-viewer";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalShowPageRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    VerificationTagComponentModule,
    ImageViewerModule,
    FontAwesomeModule
  ],
  declarations: [ModalShowPage, CommentsPage]
})
export class ModalShowPageModule {}
