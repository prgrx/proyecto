import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NameByIdPipe } from "./name-by-id.pipe";

@NgModule({
  declarations: [NameByIdPipe],
  imports: [CommonModule],
  exports: [NameByIdPipe]
})

export class PipesModule {}