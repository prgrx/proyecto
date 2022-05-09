import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from 'src/shared/interfaces/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  @Input() product: Product;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.doc('/products/' + this.product.id).valueChanges().subscribe( (value) => {
      this.product = value as Product;
    })
  }

}
