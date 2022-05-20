import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/shared/services/conversation.service';
import { ProductService } from 'src/shared/services/product.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  conversations : number = 0
  convesationSub : Subscription

  products : number = 0
  productSub : Subscription

  constructor(
    private conversationService: ConversationService,
    private productService: ProductService
  ) {

    this.convesationSub = this.conversationService.getNotifications()
      .subscribe(res => {
        this.conversations = res.length;
      });

    this.productSub = this.productService.getNotifications()
      .subscribe(res => {
        this.products = res.length;
      })

  }

  ngOnDestroy(){
    this.convesationSub.unsubscribe();
    this.productSub.unsubscribe();
  }

}
