import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';
import { ConversationService } from 'src/shared/services/conversation.service';
import { ProductService } from 'src/shared/services/product.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  conversations: number = 0;
  convesationSub: Subscription;
  user: User;
  userSub: Subscription;
  products: number = 0;
  productSub: Subscription;
  userId: string = JSON.parse(localStorage.getItem('user')).uid;

  constructor(
    private conversationService: ConversationService,
    private productService: ProductService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.convesationSub = this.conversationService
      .getNotifications()
      .subscribe((res) => {
        this.conversations = res.length;
      });

    this.productSub = this.productService
      .getNotifications()
      .subscribe((res) => {
        this.products = res.length;
      });

    this.userSub = this.firestore
      .doc('/users/' + this.userId)
      .valueChanges()
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  ngOnDestroy() {
    this.convesationSub.unsubscribe();
    this.productSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
