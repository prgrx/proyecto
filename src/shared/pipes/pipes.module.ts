import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExcludeMyselfPipe } from "./exclude-myself";
import { NameByIdPipe } from "./name-by-id.pipe";
import { PhotoByIdPipe } from "./photo-by-id.pipe";
import { ReplaceLineBreaksPipe } from "./replace-line-breaks.pipe";

@NgModule({
  declarations: [
    NameByIdPipe, 
    ExcludeMyselfPipe, 
    PhotoByIdPipe,
    ReplaceLineBreaksPipe
  ],
  imports: [CommonModule],
  exports: [
    NameByIdPipe, 
    ExcludeMyselfPipe, 
    PhotoByIdPipe,
    ReplaceLineBreaksPipe
  ]
})

export class PipesModule {}