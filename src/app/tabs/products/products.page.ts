import { Component } from '@angular/core';
import { collection, query, where } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { CrudDB } from 'src/shared/services/crud-db.service';
import { ModalCreatePage } from './modal-create/modal-create.page';
import { ModalShowPage } from './modal-show/modal-show.page';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss']
})
export class ProductsPage{

  previousProduct:FormGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    image: new FormControl(),
    action: new FormControl(),
    price: new FormControl(0)
  });

  previousImg: string;
  allProducts: Product[] = [];
  userProducts: Product[] = [];
  productsSub: Subscription;
  segmentProducts: string = 'allProducts';

  constructor(private modalController: ModalController, private db: AngularFirestore) {}

  ngOnInit() {
    this.getAllProducts();
  }

  ionViewDidLeave(){
    this.productsSub.unsubscribe();
  }

  async openModalShowProduct(product : Product) {
    const modal = await this.modalController.create({
      component: ModalShowPage,
      componentProps: {
        'product' : product
      }
    });

    return await modal.present();
  }

  async openModalCreateProduct() {
    const modal = await this.modalController.create({
      component: ModalCreatePage,
      componentProps: {
        'previousProduct': this.previousProduct,
        'previousImg' : this.previousImg
      }
    });

    modal.onDidDismiss().then((product) => {
      this.previousProduct = product.data.form;
      this.previousImg = product.data.imgBase64;
    });

    return await modal.present();
  }

  getAllProducts() {
    let id_user: string = JSON.parse(localStorage.getItem('user')).uid;

    this.productsSub = this.db.collection('/products').snapshotChanges().subscribe( (productsSnapshot) => {
      this.allProducts = [];
      console.log(productsSnapshot)
      productsSnapshot.forEach((productDB) => {
        let product : Product = productDB.payload.doc.data() as Product;
        this.allProducts.push(product)
        if (product.user_id == id_user) {
          this.userProducts.push(productDB.payload.doc.data() as Product)
        }
      });
    })
  }
}
