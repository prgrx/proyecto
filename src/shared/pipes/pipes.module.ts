import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExcludeMyselfPipe } from "./exclude-myself";
import { NameByIdPipe } from "./name-by-id.pipe";

@NgModule({
  declarations: [NameByIdPipe, ExcludeMyselfPipe],
  imports: [CommonModule],
  exports: [NameByIdPipe, ExcludeMyselfPipe]
})

export class PipesModule {}