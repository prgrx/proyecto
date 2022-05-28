import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FieldValue } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { NameByIdPipe } from 'src/shared/pipes/name-by-id.pipe';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.page.html',
  styleUrls: ['./modify-product.page.scss'],
})
export class ModifyProductPage implements OnInit {
  products: Product[];
  allProducts: Product[];
  productsSub: Subscription;
  searchForm: FormGroup = new FormGroup({
    searchValue: new FormControl(''),
  });

  constructor(
    private firestore: AngularFirestore,
    private nameById: NameByIdPipe,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productsSub = this.firestore
      .collection('/products')
      .valueChanges()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.allProducts = this.products;
      });
    this.searchForm.controls.searchValue.valueChanges.subscribe(
      (value: string) => {
        this.filterEverything(value);
      }
    );
  }

  ionViewDidLeave(): void {
    this.productsSub.unsubscribe();
  }

  showDate(timestamp: FieldValue): Date {
    return new Date(timestamp['seconds'] * 1000);
  }

  async showReports(product: Product): Promise<void> {
    var options = {
      cssClass: 'alertDelete',
      header: 'Reportes',
      message:
        'Estos son los usuarios que han reportado el producto ' +
        product.name +
        ' de ' +
        (await this.nameById.transform(product.user_id)) +
        ':',
      buttons: [
        {
          text: 'Cancelar',
        },
      ],
      inputs: [],
    };
    options.inputs = [];

    for (let report of product.reports) {
      options.inputs.push({
        name: 'options',
        value: await this.nameById.transform(report),
        label: 'Nombres',
        cssClass: 'name',
      });
    }
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  async openAlertDelete(product: Product) {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Eliminar Producto',
      message: '¿Estás seguro de que quieres eliminar ' + product.name + '?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          handler: () => {
            const productRef: AngularFirestoreDocument<any> =
              this.firestore.doc(`products/${product.id}`);
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

  redirectToProduct(idProduct: string): void {
    this.router.navigate(['/app/products/' + idProduct]);
  }

  filterEverything(searchValue: string): void {
    if (searchValue) {
      this.products = this.allProducts.filter((product: Product) => {
        return product.name.toLowerCase().includes(searchValue.toLowerCase());
      });
    } else {
      this.products = this.allProducts;
    }
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }
}
