import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Message } from 'src/shared/interfaces/message';
import { ConversationService } from 'src/shared/services/conversation.service';
import { Photo } from 'src/shared/interfaces/dummyProfilePhoto'
import { serverTimestamp } from '@angular/fire/firestore';
import { LogedUser } from 'src/shared/constants/logedUser';
import { Conversation } from 'src/shared/interfaces/conversation';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomChangeDirective } from 'src/shared/directives/dom-change.directive';
import { User } from 'src/shared/interfaces/user';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  @ViewChild('content') private content: any;

  converId : string
  conversationData: Conversation

  conversation: Conversation
  converSub : Subscription

  messages: Array<Message>
  messagesSub: Subscription
  
  myId = JSON.parse(localStorage.getItem('user')).uid;
  contactName: string
  contactUid: string
  contactBlocks: string[];

  myself : User
  myselfSub : Subscription

  photo : string

  msgToSend = new FormControl(''/*, Validators.requiredTrue*/)

  constructor(
    public cs : ConversationService,
    private activatedRoute : ActivatedRoute,
    private af : AngularFirestore,
    public alertCrtl : AlertController,
    private userService : UserService
  ) { }

  ngOnInit() {
    this.converId = this.activatedRoute.snapshot.paramMap.get('id');

    this.cs.getOneByIdData(this.converId)
      .then( async conversation => {
        this.conversationData = conversation.data() as Conversation;

        this.af.firestore.doc(`users/${
          this.conversationData.members.filter( x => x != JSON.parse(localStorage.getItem('user')).uid )[0]
        }`).get().then( x => {
          this.contactName = x.data()['name']
          this.contactUid = x.data()['uid']
          this.contactBlocks = x.data()['blocks']
          this.photo = x.data()['photo']
        })

      });

    this.converSub = this.cs.getOneById(this.converId)
      .subscribe ( conversation => {
        this.conversation = conversation as Conversation;
      });

    this.myselfSub = this.userService.get(this.userService.getMyUserId()).subscribe( (user) => {
      this.myself = user as User;
    });
  }

  ionViewWillEnter(){
    this.messagesSub = this.cs.getMessages(this.converId, 25)
      .subscribe ( messages => {
        this.messages = messages as Message[];
      });
    this.scrollToBottom(3000);
  }

  ionViewDidEnter(){
    this.scrollToBottom(300);
  }

  ionViewDidLeave(){
    this.messagesSub.unsubscribe();
    this.converSub.unsubscribe();
  }

  ngOnDestroy(){
    this.messagesSub.unsubscribe();
    this.converSub.unsubscribe();
    this.myselfSub.unsubscribe();
  }

  onDomChange($event: Event): void {
    this.scrollToBottom(0);
  }

  sendMessage(){

    if (this.msgToSend.value != ''){

      let message = {
        content: this.msgToSend.value,
        senderId: JSON.parse(localStorage.getItem('user')).uid,
        createdAt: serverTimestamp()
      } as Message;

      // Comprobar si es un día distinto
      let today = (new Date()).getDate();
      let lastMessageDay = (new Date(this.conversation?.updatedAt['seconds']*1000)).getDate();
      if (today != lastMessageDay){
        this.cs.postMessage(this.converId, {
          system: true,
          createdAt: serverTimestamp()
        } as Message);
      }

      this.cs.postMessage(this.converId, message);

      //Modificar mensajes leídos y no leídos
      let myself = this.userService.getMyUserId();

      this.cs.updateConversation(this.converId,{
        updatedAt: serverTimestamp(),
        lastMessage: this.msgToSend.value,
        [myself]: 0,
        [this.conversation.members.find(x=>x!=myself)]: ++this.conversation[this.conversation.members.find(x=>x!=myself)]
      });

      this.msgToSend.setValue('');

    }

  }

  scrollToBottom(delay){
    setTimeout(() =>{
      this.content.scrollToBottom(300);
    }, delay);
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  delete(slidingItem: any, conversationId: string, messageId: string){
    this.presentConfirm(
      '¿Borrar mensaje?',
      'Dejará de mostrarse para ambos usuarios.',
      'Borrar',
      async () => {
        this.cs.deleteMessage(conversationId, messageId);
        slidingItem.close();
      }
    );
  }

  clearUnread(conversationId){
    this.cs.updateConversation(conversationId,{
      [JSON.parse(localStorage.getItem('user')).uid]: 0
    });
}

  async presentConfirm(
    title:string, 
    text:string, 
    button:string, 
    action:any
  ) {
    let alert = await this.alertCrtl.create({
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
