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

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  @ViewChild('content') private content: any;

  converId : string
  conversation: Conversation
  converSub : Subscription

  messages: Array<Message>
  messageSub: Subscription
  
  myself = LogedUser.uid;
  contactName: string

  photo = Photo

  msgToSend = new FormControl(''/*, Validators.requiredTrue*/)

  constructor(
    public cs : ConversationService,
    private activatedRoute : ActivatedRoute,
    private af : AngularFirestore
  ) { }

  ngOnInit() {
    this.converId = this.activatedRoute.snapshot.paramMap.get('id');

    this.cs.getOneByIdData(this.converId)
      .then( async conversation => {
        this.conversation = conversation.data() as Conversation;

        this.af.firestore.doc(`users/${
          this.conversation.members.filter( x => x != LogedUser.uid )[0]
        }`).get().then( x => {
          this.contactName = x.data()['name']
          this.photo = x.data()['photo']
        })

      });

      this.display(2000);
  }

  ionViewWillEnter(){

    this.messageSub = this.cs.getMessages(this.converId, 25)
      .subscribe ( messages => {
        this.messages = messages as Message[];
      });

  }

  ionViewDidEnter(){
    this.scrollToBottom(500);
    this.display(500);
  }

  ionViewDidLeave(){
  }

  ngOnDestroy(){
    this.messageSub.unsubscribe();
  }

  onDomChange($event: Event): void {
    this.scrollToBottom(0);
    this.display(0);
  }

  sendMessage(){

    if (this.msgToSend.value != ''){

      let message = {
        content: this.msgToSend.value,
        senderId: LogedUser.uid,
        createdAt: serverTimestamp()
      } as Message;

      this.cs.postMessage(this.converId, message);

      this.cs.updateConversation(this.converId,{
        updatedAt: serverTimestamp(),
        lastMessage: this.msgToSend.value
      });

      this.msgToSend.setValue('');

    }

  }

  scrollToBottom(delay){
    setTimeout(() =>{
      this.content.scrollToBottom(0);
    }, delay);
  }

  display(time:number){
    setTimeout(()=>{
      [].forEach.call(
        document.getElementsByClassName('unhide'),
        function (el) {
          el.style.opacity = '1';
          el.style.animationName = 'smooth';
          el.style.animationDuration = '.5s';
        }
        );
    },time)
  }


}
