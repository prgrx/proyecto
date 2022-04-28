import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { CrudDB } from 'src/shared/services/crud-db.service';
import { ModalCreatePage } from './modal-create/modal-create.page';

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
  products: Product[] = [];
  productsSub: Subscription;

  constructor(private modalController: ModalController, private crudDB : CrudDB, private zone: NgZone, private db: AngularFirestore) {}

  ngOnInit() {
    this.getAllProducts();
  }

  ionViewDidLeave(){
    this.productsSub.unsubscribe();
  }

  async openModal() {
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
    this.productsSub = this.db.collection('/products').snapshotChanges().subscribe( (productsSnapshot) => {
      this.products = [];
      productsSnapshot.forEach((productDB) => {
        this.products.push(productDB.payload.doc.data() as Product)
      });
      console.log(this.products)
    })
  }
}
