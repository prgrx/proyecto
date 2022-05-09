import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { ModalCreatePage } from './modal-create/modal-create.page';
import { ModalShowPage } from './modal-show/modal-show.page';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
})
export class ProductsPage {
  previousProduct: FormGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    image: new FormControl(),
    action: new FormControl(),
    price: new FormControl(0),
  });
  previousImg: string;

  allProducts: Product[] = [];
  principalProducts: Product[] = [];
  allUserProducts: Product[] = [];
  userProducts: Product[] = [];
  productsSub: Subscription;
  segmentProducts: string = 'allProducts';
  dataLoaded: boolean = false;
  countAllProducts: number = 6;
  countUserProducts: number = 6;
  id_user: string = JSON.parse(localStorage.getItem('user')).uid;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  ionViewDidLeave() {
    this.productsSub.unsubscribe();
  }

  async openModalShowProduct(product: Product): Promise<void> {
    console.log(product)
    const modal = await this.modalController.create({
      component: ModalShowPage,
      componentProps: {
        product: product,
      },
    });

    await modal.present();
  }

  async openModalCreateProduct(): Promise<void> {
    const modal = await this.modalController.create({
      component: ModalCreatePage,
      componentProps: {
        previousProduct: this.previousProduct,
        previousImg: this.previousImg,
        action: 'create',
      },
    });

    modal.onDidDismiss().then((product) => {
      this.previousProduct = product.data.form;
      this.previousImg = product.data.imgBase64;
    });

    await modal.present();
  }

  getAllProducts() {
    this.productsSub = this.firestore
    .collection('/products', ref => ref.limit(this.countAllProducts))
    .snapshotChanges()
    .subscribe((productsSnapshot) => {
        this.allProducts = [];
        this.userProducts = [];
        productsSnapshot.forEach((productDB) => {
          let product: Product = productDB.payload.doc.data() as Product;
          this.allProducts.push(product);
          if (product.user_id == this.id_user) {
            this.userProducts.push(product);
          }
        });
        this.dataLoaded = true;
      });
  }

  loadAllProductData(event: any) {
    setTimeout(() => {
      event.target.complete();
      let lastProduct: Product = this.allProducts[this.allProducts.length - 1];
      console.log(lastProduct)
      let lastProductRef: any;
      this.firestore.doc('/products/' + lastProduct.id).snapshotChanges().subscribe((product) => {
        lastProductRef = product.payload;
        this.nextProducts(lastProductRef);
        this.countAllProducts += 4;
      });
    }, 1000);
  }
  
  nextProducts(lastProductRef: any, user_id? : string) {
    this.productsSub = this.firestore
    .collection('/products', ref => ref.orderBy('id').startAfter(lastProductRef).limit(4))
    .snapshotChanges()
    .subscribe((productsSnapshot) => {
      console.log('LAgo')
      console.log(productsSnapshot)
      productsSnapshot.forEach((productDB) => {
        let product: Product = productDB.payload.doc.data() as Product;
        if (user_id) {
          if (product.user_id == this.id_user) {
            if (this.countUserProducts - 4 <= this.userProducts.length) {
              this.userProducts.push(product);
            }
          }
        }else {
          if (this.countAllProducts - 4 <= this.allProducts.length) {
            this.allProducts.push(product);
          }
        }
      });
    });
  }
  
  loadUserProductData(event) {
    // setTimeout(() => {
    //   event.target.complete();
    //   let lastProduct: Product = this.userProducts[this.userProducts.length - 1];
    //   let lastProductRef: any;
    //   this.firestore.doc('/products/' + lastProduct.id).snapshotChanges().subscribe((product) => {
    //     lastProductRef = product.payload.data();
    //     this.nextProducts(lastProductRef, lastProduct.user_id);
    //     if (this.countUserProducts - 4 > this.userProducts.length) {
    //       event.target.disabled = true;
    //     }
    //     this.countUserProducts += 4;
    //   });
    // }, 1000);
  }

}
