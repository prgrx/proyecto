import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  actionValue: Subscription;

  constructor(private modalController: ModalController, private db : AngularFirestore) { }
  
  ngOnInit() {
    this.productForm = new FormGroup({
      name: new FormControl(this.previousProduct.controls.name.value),
      description: new FormControl(this.previousProduct.controls.description.value),
      image: new FormControl(this.previousImg),
      action: new FormControl(this.previousProduct.controls.action.value),
      price: new FormControl(this.previousProduct.controls.price.value)
    });

    this.resetPrice();

    if (this.previousImg) {
      this.setImgBackground(this.previousImg);
    }
  }

  ionViewDidLeave() {
    console.log('He entrado')
    this.modalController.dismiss({
      'form': this.productForm,
      'imgBase64' : this.previousImg ? this.previousImg : this.imgBase64
    });
    this.actionValue.unsubscribe();
  }

  dismissModal(): void {
    this.modalController.dismiss({
     'form': this.productForm,
     'imgBase64' : this.previousImg ? this.previousImg : this.imgBase64
    });
  }

  sendProduct() {
    if (this.productForm.valid) {
      let description = this.productForm.controls.description.value.replaceAll('\n', "\\n")
      let product: Product = {
        id: this.db.createId(),
        name: this.productForm.controls.name.value,
        description: description,
        image: this.imgBase64 ? this.imgBase64 : this.previousImg,
        price: this.productForm.controls.price.value,
        user_id: JSON.parse(localStorage.getItem('user')!).uid
      };
      const productRef: AngularFirestoreDocument<any> = this.db.doc(
        `products/${product.id}`
      );
      return productRef.set(product, {
        merge: true,
      });
    }
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
    
    if (size < 100) {
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

  resetPrice() {
    this.actionValue = this.productForm.controls.action.valueChanges.subscribe( (value : boolean) => {
      if (value) {
        this.productForm.controls.price.setValue(0);
      }
    });
  }
}
