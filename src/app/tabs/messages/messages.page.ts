import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/shared/services/conversation.service';
import { UserService } from 'src/shared/services/user.service';
import { Conversation } from 'src/shared/interfaces/conversation';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Photo } from 'src/shared/interfaces/dummyProfilePhoto';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss']
})
export class MessagesPage {

  @ViewChild('content') private content: any;

  conversations : Array<Conversation> 
  conversSub : Subscription

  user : any

  photo = Photo 

  constructor(
    private conversationService : ConversationService,
    public userService : UserService,
    public af : AngularFirestore,
    public alertCtrl : AlertController
  ) {}

  ngOnInit(){
    this.conversSub = this.conversationService.getAll()
    .subscribe( (conversations) => {
      this.conversations = conversations as Conversation[]
    });
  }

  ionViewWillEnter(){
    this.user = this.userService.getMyUserId();
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave(){
  }

  onDomChange($event: Event): void {
  }

  ngOnDestroy(){
    this.conversSub.unsubscribe();
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  delete(slidingItem, conversationId){
    this.presentConfirm(
      '¿Borrar conversación?',
      'Se borrará para ambos usuarios.',
      'Borrar',
      () => {
        this.conversationService.deleteConversation(conversationId);
        slidingItem.close();
      }
    );
  }

  clearUnread(conversationId){
          this.conversationService.updateConversation(conversationId,{
            [this.userService.getMyUserId()]: 0
          });
  }

  async presentConfirm(
    title:string, 
    text:string, 
    button:string, 
    action:any
  ) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: button,
          handler: action
        }
      ]
    });
    await alert.present();
  }

}