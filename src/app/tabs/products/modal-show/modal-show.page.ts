import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/shared/interfaces/product';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.page.html',
  styleUrls: ['./modal-show.page.scss'],
})
export class ModalShowPage implements OnInit {

  @Input() product: Product;
  description: string;

  constructor(private modalController: ModalController) { }
  
  ngOnInit() {
    this.product.description = this.product!.description.replace(/\\n/gm, "\n");
    console.log(this.product.description)
  }

  dismissModal(): void {
    this.modalController.dismiss();
  }
}
