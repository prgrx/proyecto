import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { Product } from 'src/shared/interfaces/product';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.page.html',
  styleUrls: ['./modal-create.page.scss'],
})
export class ModalCreatePage implements OnInit  {

  @Input() previousProduct: FormGroup;
  @Input() previousImg: string;
  productForm: FormGroup;
  imgBase64: string;
  productsCollection: AngularFirestoreDocument<any>;

  constructor(private modalCtrl: ModalController, private db : AngularFirestore) { }
  
  ngOnInit() {
    this.productForm = new FormGroup({
      name: new FormControl(this.previousProduct.controls.name.value),
      description: new FormControl(this.previousProduct.controls.description.value),
      image: new FormControl(this.previousImg),
      action: new FormControl(this.previousProduct.controls.action.value),
      price: new FormControl(this.previousProduct.controls.price.value)
    });

    if (this.previousImg) {
      this.setImgBackground(this.previousImg);
    }
  }

  dismissModal(): void {
    this.modalCtrl.dismiss({
     'form': this.productForm,
     'imgBase64' : this.previousImg ? this.previousImg : this.imgBase64
    });
  }

  sendProduct() {
    let product: Product = {
      id: this.db.createId(),
      name: this.productForm.controls.name.value,
      description: this.productForm.controls.description.value,
      image: this.imgBase64 ? this.imgBase64 : this.previousImg,
      sale: (this.productForm.controls.action.value == "true"),
      price: this.productForm.controls.price.value
    };
    const productRef: AngularFirestoreDocument<any> = this.db.doc(
      `products/${product.id}`
    );
    return productRef.set(product, {
      merge: true,
    });
  }

  resetProduct(): void {
    this.productForm.reset();
    this.removeImgBackground();
  }

  getPhoto(event: any): void {
    this.previousImg = '';
    let photo: File = event.target.files[0];
    let size: number = +((event.target.files[0].size/1024/1024).toFixed(2));
    console.log(size + 'MB')
    
    if (size < 1) {
      if (photo != undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = () => {
          if (reader.result != null) {
            this.imgBase64 = reader.result.toString();
            this.productForm.controls.image.value;
            this.setImgBackground(this.imgBase64);
          }
        };
      } 
    }
  }

  setImgBackground(img: string): void {
    let divBackImg: HTMLElement = document.querySelector('.item-backImage');
    divBackImg.style.display = 'block';
    divBackImg.style.backgroundImage = "url('" + img.replace(/(\r\n|\n|\r)/gm, '') + "')";
  }

  removeImgBackground(): void {
    let divBackImg: HTMLElement = document.querySelector('.item-backImage');
    divBackImg.style.display = 'none';
  }
}
