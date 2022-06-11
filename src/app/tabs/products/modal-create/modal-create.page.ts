import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.page.html',
  styleUrls: ['./modal-create.page.scss'],
})
export class ModalCreatePage implements OnInit {
  @Input() previousProduct: FormGroup;
  @Input() previousImg: string;
  @Input() action: string;
  productForm: FormGroup;
  imgBase64: string;
  submitted: boolean = false;
  productsCollection: AngularFirestoreDocument<any>;
  actionValue: Subscription;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl(
        this.previousProduct.controls.name.value,
        Validators.required
      ),
      description: new FormControl(
        this.previousProduct.controls.description.value,
        Validators.required
      ),
      image: new FormControl(this.previousImg,
        Validators.required
      ),
      action: new FormControl(
        this.previousProduct.controls.action.value,
        Validators.required
      ),
      price: new FormControl(
        this.previousProduct.controls.price.value,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(.[1-9]\d)?$/),
        ])
      ),
    });

    this.resetPrice();

    if (this.previousImg) {
      this.setImgBackground(this.previousImg);
    }
  }

  ionViewDidLeave(): void {
    this.modalController.dismiss({
      form: this.productForm,
      imgBase64: this.previousImg ? this.previousImg : this.imgBase64,
    });
    this.actionValue.unsubscribe();
  }

  dismissModal(): void {
    this.modalController.dismiss({
      form: this.productForm,
      imgBase64: this.previousImg ? this.previousImg : this.imgBase64,
    });
  }

  sendProduct(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      let description = this.productForm.controls.description.value.replaceAll(
        '\n',
        '\\n'
      );
      let product: Product = {
        id: this.previousProduct.controls.id
          ? this.previousProduct.controls.id.value
          : this.firestore.createId(),
        name: this.productForm.controls.name.value,
        description: description,
        image: this.imgBase64 ? this.imgBase64 : this.previousImg,
        price: this.productForm.controls.price.value,
        last_modified: serverTimestamp(),
      };

      if (this.action === 'create'){
        product.user_id = JSON.parse(localStorage.getItem('user')!).uid;
        product.unread = [];
        product.reports = [];
      }

      const productRef: AngularFirestoreDocument<any> =
        this.firestore.doc(`products/${product.id}`);

      if (this.action === 'create') {
        productRef.set(product, {
          merge: true,
        });
        this.showToast('¡Se ha creado el producto correctamente!', 5);
        this.resetProduct();
        this.previousImg = '';
        this.imgBase64 = '';
        this.dismissModal();
      } else {
        productRef.update(product);
        this.showToast('¡Se ha actualizado el producto correctamente!', 5);
        this.modalController.dismiss({
          productModified: product,
        });
      }
      this.submitted = false;
    } else {
      this.showToast('No se ha podido crear el producto', 3);
    }
  }

  resetProduct(): void {
    this.productForm.reset();
    this.productForm.controls.price.setValue(0);
    this.removeImgBackground();
    this.submitted = false;
  }

  getPhoto(event: any): void {
    this.previousImg = '';
    let photo: File = event.target.files[0];
    let size: number = +(photo.size / 1024 / 1024).toFixed(2);

    if (size < 1) {
      if (photo != undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = () => {
          if (reader.result != null) {
            this.imgBase64 = reader.result.toString();
            this.setImgBackground(this.imgBase64);
          }
        };
      }
    }
  }

  setImgBackground(img: string): void {
    let divBackImg: HTMLElement = document.querySelector('.item-backImage');
    divBackImg.style.display = 'block';
    divBackImg.style.backgroundImage =
      "url('" + img.replace(/(\r\n|\n|\r)/gm, '') + "')";
  }

  removeImgBackground(): void {
    let divBackImg: HTMLElement = document.querySelector('.item-backImage');
    divBackImg.style.display = 'none';
  }

  resetPrice(): void {
    this.actionValue = this.productForm.controls.action.valueChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.productForm.controls.price.setValue(0);
        }
      }
    );
  }

  async showToast(message: string, seconds: number): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    toast.present();
  }
}
