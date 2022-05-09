import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { ToastMessageService } from 'src/shared/services/toast-message.service';

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
  productsCollection: AngularFirestoreDocument<any>;
  actionValue: Subscription;

  constructor(
    private modalController: ModalController,
    private toastMessage: ToastMessageService,
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
          Validators.pattern(/^0{1}$|^[1-9]*$|^([1-9]*.[0-9]{2})$|^([0]{1}.[0-9]{2})$/),
        ])
      ),
    });

    this.resetPrice();
    if (this.previousImg) {
      this.setImgBackground(this.previousImg);
    }
  }

  ionViewDidLeave(): void {
    this.dismissModal();
    this.actionValue.unsubscribe();
  }

  dismissModal(): void {
    this.modalController.dismiss({
      form: this.productForm,
      imgBase64: this.previousImg ? this.previousImg : this.imgBase64
    });
  }

  sendProduct(): void {
    if (this.productForm.valid) {
      let product: Product = {
        id: this.previousProduct.controls.id
          ? this.previousProduct.controls.id.value : this.firestore.createId(),
        name: this.productForm.controls.name.value,
        description: this.productForm.controls.description.value.replaceAll('\n','\\n'),
        image: this.imgBase64 ? this.imgBase64 : this.previousImg,
        price: this.productForm.controls.price.value,
        user_id: JSON.parse(localStorage.getItem('user')!).uid,
      };

      const productRef: AngularFirestoreDocument<Product> =
        this.firestore.doc(`products/${product.id}`);

      if (this.action === 'create') {
        this.createProduct(productRef, product);
      } else {
        this.updateProduct(productRef, product);
      }

    } else {
      this.toastMessage.createToast('No se ha podido crear el producto', 3);
    }
  }

  createProduct(productRef : AngularFirestoreDocument<Product>, product: Product): void {
    productRef.set(product, {
      merge: true,
    });
    this.toastMessage.createToast('¡Se ha creado el producto correctamente!', 5);
    this.resetProduct();
    this.dismissModal();
  }

  updateProduct(productRef : AngularFirestoreDocument<Product>, product: Product): void {
    productRef.update(product);
    this.toastMessage.createToast('¡Se ha actualizado el producto correctamente!', 5);
    this.modalController.dismiss({
      productModified: product,
    });
  }

  resetProduct(): void {
    this.productForm.reset();
    this.productForm.controls.price.setValue(0);
    this.previousImg = '';
    this.imgBase64 = '';
    this.removeImgBackground();
  }

  getPhoto(event: any): void {
    this.previousImg = '';
    let photo: File = event.target.files[0];
    let size: number = +(event.target.files[0].size / 1024 / 1024).toFixed(2);

    if (size < 1) {
      if (photo != undefined) {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = () => {
          if (reader.result != null) {
            this.imgBase64 = reader.result.toString();
            this.setImgBackground(this.imgBase64);
          }
        };
      }
    }else {
      this.toastMessage.createToast('No se pueden subir imágenes de más de 1MB', 4)
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

  resetPrice() {
    this.actionValue = this.productForm.controls.action.valueChanges.subscribe(
      (value: boolean) => {
        if (value) {
          this.productForm.controls.price.setValue(0);
        }
      }
    );
  }
}
