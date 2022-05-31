import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private userService: UserService,
    private firestore: AngularFirestore
  ) { }

  getAll(){
    return this.firestore
      .collection<Product>('products', ref => ref.orderBy('last_modified', 'asc'))
      .valueChanges();
  }

  getNotifications(){
    return this.firestore
    .collection<Product>('products',
      ref => ref
        .where("user_id", "==", this.userService.getMyUserId())
        .where("unread", "!=", [])
        .limit(1)
    )
    .valueChanges();
  }

  update(productId:string, data:Product){
    this.firestore
      .doc(`products/${productId}`)
      .update(data)
  }

}
