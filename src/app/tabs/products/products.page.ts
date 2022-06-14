import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuController, ModalController } from '@ionic/angular';
import { OrderByDirection } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { ProductService } from 'src/shared/services/product.service';
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
  skeletons: number[] = [0, 1, 2, 3, 4, 5, 6, 7]
  productsNotifications: number = 0;
  notificationSub: Subscription;
  id_user: string = JSON.parse(localStorage.getItem('user')).uid;


  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private menuController: MenuController,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.formatLimit();
    this.notificationSub = this.productService.getNotifications().subscribe(res => {
      this.productsNotifications = res.length;
    });    
  }

  async ionViewWillEnter(): Promise<void> {
    if (!await this.menuController.isEnabled('filtersSort')) {
      this.menuController.enable(true, 'filtersSort');
    }
    this.getAllProducts();
  }
  
  async ionViewDidLeave(): Promise<void> {
    this.notificationSub.unsubscribe();
    this.productsSub.unsubscribe();
    if (await this.menuController.isOpen('filtersSort')) {
      await this.menuController.close('filtersSort');
    }
  }

  async openModalShowProduct(product: Product): Promise<void> {
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

  getAllProducts(): void {
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
          if (product.user_id == this.id_user) {
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

  loadPrincipalProductData(event): void {
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

  loadUserProductData(event): void {
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

  changeSort(orderBy: string, orderDirection: OrderByDirection): void {
    this.orderBy = orderBy;
    this.orderDirection = orderDirection;
    this.getAllProducts();
    this.closeMenuSort()
  }

  async openMenuSort(): Promise<void> {
    await this.menuController.open('filtersSort');
  }

  async closeMenuSort(): Promise<void> {
    await this.menuController.close('filtersSort');
  }

  setRead(productId){
    this.productService.update(
      productId,
      {unread: []} as Product
    );
  }

  formatLimit(): void {
    let actualWidth = window.innerWidth;
    if (actualWidth < 1200) {
      this.limitAllProducts = 6;
      this.limitUserProducts = 6;
    } else {
      this.limitAllProducts = 8;
      this.limitUserProducts = 8;
    }
  }
  
}
