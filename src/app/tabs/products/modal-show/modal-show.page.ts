import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { User } from 'src/shared/interfaces/user';
import { Product } from 'src/shared/interfaces/product';
import { ModalCreatePage } from '../modal-create/modal-create.page';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.page.html',
  styleUrls: ['./modal-show.page.scss'],
})
export class ModalShowPage implements OnInit {
  @Input() product: Product;
  description: string;
  isSameUser: boolean;
  isAdmin: boolean;
  productForm: FormGroup;
  userProduct: User;
  userProductsSubscription: Subscription;
  activatedRouteSubscription: Subscription;
  userSub: Subscription;
  id: string;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.id = params.id;
          this.firestore
            .doc('/products/' + params.id)
            .valueChanges()
            .subscribe((product: Product) => {
              this.product = product;
              this.initialActions();
            });
        } else {
          this.initialActions();
        }
      }
    );
  }

  ionViewWillLeave(): void {
    this.userProductsSubscription.unsubscribe();
    this.activatedRouteSubscription.unsubscribe();
    this.userSub.unsubscribe();
  }

  initialActions(): void {
    let idUser: string = JSON.parse(localStorage.getItem('user')!).uid;
    this.isSameUser = idUser == this.product?.user_id ? true : false;
    this.product.description = this.product.description.replace(/\\n/gm, '\n');
    this.userSub = this.firestore
      .doc('/users/' + idUser)
      .valueChanges()
      .subscribe((user: User) => {
        this.isAdmin = user.isAdmin;
      });
    this.getUserProduct();
  }

  dismissModal(): void {
    if (this.id) {
      this.router.navigate(['/app/products'], { replaceUrl: true });
    } else {
      this.modalController.dismiss();
    }
  }

  getUserProduct(): void {
    this.userProductsSubscription = this.firestore
      .doc('/users/' + this.product.user_id)
      .valueChanges()
      .subscribe((user) => {
        this.userProduct = user as User;
      });
  }

  async openModalCreate() {
    this.product.description = this.product.description.replace(/\\n/gm, '\n');
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
        this.product.description = this.product.description.replace(
          /\\n/gm,
          '\n'
        );
      }
    });

    await modal.present();
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
          handler: () => {
            const productRef: AngularFirestoreDocument<any> =
              this.firestore.doc(`products/${this.product.id}`);
            productRef.delete();
            this.showToast('¡Se ha eliminado el producto correctamente!', 5);
            this.modalController.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, seconds: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    await toast.present();
  }
}
