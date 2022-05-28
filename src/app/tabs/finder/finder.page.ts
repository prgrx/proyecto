import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/interfaces/product';
import { User } from 'src/shared/interfaces/user';
import { ConversationService } from 'src/shared/services/conversation.service';
import { ProductService } from 'src/shared/services/product.service';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-finder',
  templateUrl: 'finder.page.html',
  styleUrls: ['finder.page.scss']
})
export class FinderPage {

  usersSearch = true;
  users : User[]
  allUsers: User[]
  usersSub : Subscription

  products : Product[]
  allProducts: Product[]
  productsSub : Subscription

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private conversationService: ConversationService,
    public router: Router
  ) {}

  ngOnInit(){
    this.usersSub = this.userService.getAll().subscribe(
      users => { this.users = this.allUsers = users as User[] }
    )

    this.productsSub = this.productService.getAll().subscribe(
      products => { this.products = this.allProducts = products as Product[] }
    )
  }

  openMenuSort(){
    
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  ngOnDestroy(){
    this.usersSub.unsubscribe();
    this.productsSub.unsubscribe();
  }


  async contact(id:string){
    let conversationId = await this.conversationService.contact(
      this.userService.getMyUserId(),
      id,
      false
    );

    this.router.navigate(['app/messages/'+ conversationId]);
  }

  search(event){
    let q = event.target.value;
    if (q != ''){
      if(this.usersSearch){
        this.users = this.allUsers
        .filter(x => 
          x.name.toLowerCase().includes(q.toLowerCase()) ||
          x.email.toLowerCase().includes(q.toLowerCase())
        );
      }else{
        this.products = this.allProducts
        .filter(x => 
          x.name.toLowerCase().includes(q.toLowerCase()) ||
          x.description.toLowerCase().includes(q.toLowerCase())
        );
      }
    }else{
      if(this.usersSearch){
        this.users = this.allUsers;
      }else{
        this.products = this.allProducts;
      }
    }
  }

  toggleSearch(event){
    this.usersSearch = 
      event.target.value == 'users' 
        ? true 
        : false;
  }

}
