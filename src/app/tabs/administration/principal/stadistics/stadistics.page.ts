import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Conversation } from 'src/shared/interfaces/conversation';
import { Product } from 'src/shared/interfaces/product';
import { User } from 'src/shared/interfaces/user';

@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.page.html',
  styleUrls: ['./stadistics.page.scss'],
})
export class StadisticsPage implements OnInit {
  usersSub: Subscription;
  usersLength: number;
  productsSub: Subscription;
  productsLength: number;
  conversationsSub: Subscription;
  conversationsLength: number;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.usersSub = this.firestore
      .collection('/users/')
      .valueChanges()
      .subscribe((users: User[]) => {
        this.usersLength = users.length;
      });

    this.productsSub = this.firestore
      .collection('/products/')
      .valueChanges()
      .subscribe((products: Product[]) => {
        this.productsLength = products.length;
      });

    this.productsSub = this.firestore
      .collection('/conversations/')
      .valueChanges()
      .subscribe((conversations: Conversation[]) => {
        this.conversationsLength = conversations.length;
      });
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.productsSub.unsubscribe();
  }
}
