import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { OrderByDirection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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

  orderDirection: OrderByDirection = 'asc';
  orderBy: string = 'last_modified';

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
    public router: Router,
    public menuController: MenuController
  ) {}

  ngOnInit(){
    this.usersSub = this.userService.getAll().subscribe(
      users => { this.users = this.allUsers = users as User[] }
    )

    this.productsSub = this.productService.getAll().subscribe(
      products => { this.products = this.allProducts = products as Product[] }
    )
  }

  async ionViewWillEnter(): Promise<void> {
    if (!await this.menuController.isEnabled('searchFilter')) {
      this.menuController.enable(true, 'searchFilter');
    }
  }
  
  async ionViewDidLeave(): Promise<void> {
    if (await this.menuController.isOpen('searchFilter')) {
      await this.menuController.close('searchFilter');
    }
  }


  changeSort(orderBy: string, orderDirection: OrderByDirection): void {
    this.orderBy = orderBy;
    this.orderDirection = orderDirection;
    this.closeMenuSort();

    if(this.orderBy == 'last_modified'){
      this.products.sort(this.compareDates);
    }else{
      this.products.sort(this.comparePrices);
    }

    if(this.orderDirection == 'desc'){
      this.allProducts.reverse();
    }
  }

  async openMenuSort(): Promise<void> {
    await this.menuController.open('searchFilter');
  }

  async closeMenuSort(): Promise<void> {
    await this.menuController.close('searchFilter');
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

        if(this.orderBy == 'last_modified'){
          this.products.sort(this.compareDates);
        }else{
          this.products.sort(this.comparePrices);
        }

        if(this.orderDirection == 'desc'){
          this.allProducts.reverse();
        }
      }
    }else{
      if(this.usersSearch){
        this.users = this.allUsers;
      }else{
        this.products = this.allProducts;
        if(this.orderBy == 'last_modified'){
          this.products.sort(this.compareDates);
        }else{
          this.products.sort(this.comparePrices);
        }

        if(this.orderDirection == 'desc'){
          this.allProducts.reverse();
        }
      }
    }
  }

  toggleSearch(event){
    this.usersSearch = 
      event.target.value == 'users' 
        ? true 
        : false;
  }


  comparePrices(a,b){
    if ( a.price < b.price ){
      return -1;
    }
    if ( a.price > b.price ){
      return 1;
    }
    return 0;
  }

  compareDates(a,b){
    if ( a.last_modified < b.last_modified ){
      return -1;
    }
    if ( a.last_modified > b.last_modified ){
      return 1;
    }
    return 0;
  }

}
