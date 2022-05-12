import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExcludeMyselfPipe } from "./exclude-myself";
import { NameByIdPipe } from "./name-by-id.pipe";
import { PhotoByIdPipe } from "./photo-by-id.pipe";

@NgModule({
  declarations: [NameByIdPipe, ExcludeMyselfPipe, PhotoByIdPipe],
  imports: [CommonModule],
  exports: [NameByIdPipe, ExcludeMyselfPipe, PhotoByIdPipe]
})

export class PipesModule {}