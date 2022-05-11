import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuController, ModalController } from '@ionic/angular';
import { OrderByDirection } from 'firebase/firestore';
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

  orderDirection: OrderByDirection = 'asc';
  orderBy: string = 'last_modified';
  previousImg: string;
  allProducts: Product[] = [];
  principalProducts: Product[] = [];
  allUserProducts: Product[] = [];
  userProducts: Product[] = [];
  productsSub: Subscription;
  segmentProducts: string = 'allProducts';
  dataLoaded: boolean = false;
  limitAllProducts: number = 6;
  limitUserProducts: number = 6;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  ionViewDidLeave() {
    this.productsSub.unsubscribe();
  }

  async openModalShowProduct(product: Product) {
    const modal = await this.modalController.create({
      component: ModalShowPage,
      componentProps: {
        product: product,
      },
    });

    await modal.present();
  }

  async openModalCreateProduct() {
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
    let id_user: string = JSON.parse(localStorage.getItem('user')).uid;

    this.productsSub = this.firestore
      .collection('/products', (ref) => ref.orderBy(this.orderBy, this.orderDirection))
      .valueChanges()
      .subscribe((productsSnapshot) => {
        this.allProducts = [];
        this.allUserProducts = [];
        this.principalProducts = [];
        productsSnapshot.forEach((productDB: Product) => {
          let product: Product = productDB;
          this.allProducts.push(product);
          if (product.user_id == id_user) {
            this.allUserProducts.push(productDB);
          }
        });
        this.principalProducts = this.allProducts.slice(
          0,
          this.limitAllProducts
        );
        this.userProducts = this.allUserProducts.slice(
          0,
          this.limitUserProducts
        );
        this.dataLoaded = true;
      });
  }

  loadPrincipalProductData(event) {
    setTimeout(() => {
      event.target.complete();
      this.principalProducts.push(
        ...this.allProducts.slice(
          this.limitAllProducts,
          this.limitAllProducts + 6
        )
      );
      this.limitAllProducts += 6;
      if (this.principalProducts.length >= this.allProducts.length) {
        event.target.disabled = true;
      }
    }, 1000);
  }

  loadUserProductData(event) {
    setTimeout(() => {
      event.target.complete();
      this.userProducts.push(
        ...this.allUserProducts.slice(
          this.limitUserProducts,
          this.limitUserProducts + 6
        )
      );
      this.limitUserProducts += 6;
      if (this.userProducts.length >= this.allUserProducts.length) {
        event.target.disabled = true;
      }
    }, 1000);
  }

  changeSort(orderBy: string, orderDirection: OrderByDirection) {
    this.orderBy = orderBy;
    this.orderDirection = orderDirection;
    this.getAllProducts();
    this.closeMenuSort()
  }

  async openMenuSort() {
    await this.menuController.open('filtersSort');
  }

  async closeMenuSort() {
    
    await this.menuController.close('filtersSort');
  }
}
