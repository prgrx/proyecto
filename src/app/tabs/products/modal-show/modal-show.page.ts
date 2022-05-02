import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/shared/interfaces/product';
import { ModalCreatePage } from '../modal-create/modal-create.page';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.page.html',
  styleUrls: ['./modal-show.page.scss'],
})
export class ModalShowPage implements OnInit {
  @Input() product: Product;

  description: string;
  isSameUser: boolean;
  productForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.isSameUser =
      JSON.parse(localStorage.getItem('user')!).uid == this.product.user_id
        ? true
        : false;
    this.product.description = this.product!.description.replace(/\\n/gm, '\n');
  }

  dismissModal(): void {
    this.modalController.dismiss();
  }

  async openModalCreate() {
    this.product.description = this.product!.description.replace(/\\n/gm, '\n');
    this.productForm = new FormGroup({
      id: new FormControl(this.product.id),
      name: new FormControl(this.product.name),
      description: new FormControl(this.product.description),
      image: new FormControl(this.product.image),
      action: new FormControl(this.product.price ? 'true' : 'false'),
      price: new FormControl(this.product.price),
    });

    const modal = await this.modalController.create({
      component: ModalCreatePage,
      componentProps: {
        previousProduct: this.productForm,
        previousImg: this.product.image,
        action: 'modify',
      },
    });

    modal.onDidDismiss().then((product) => {
      if (product.data.productModified) {
        this.product = product.data.productModified;
        this.product.description = this.product!.description.replace(
          /\\n/gm,
          '\n'
        );
      }
    });

    return await modal.present();
  }

  async openAlertDelete() {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Eliminar Producto',
      message:
        '¿Estás seguro de que quieres eliminar ' + this.product.name + '?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            const productRef: AngularFirestoreDocument<any> =
              this.firestore.doc(`products/${this.product.id}`);
            productRef.delete();
            this.showToast('¡Se ha eliminado el producto correctamente!', 5);
            this.modalController.dismiss();
          },
        },
      ],
    });

    return await alert.present();
  }

  async showToast(message: string, seconds: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    toast.present();
  }
}
