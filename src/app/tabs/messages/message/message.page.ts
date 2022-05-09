import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Message } from 'src/shared/interfaces/message';
import { ConversationService } from 'src/shared/services/conversation.service';
import { Photo } from 'src/shared/interfaces/dummyProfilePhoto'
import { serverTimestamp } from '@angular/fire/firestore';
import { LogedUser } from 'src/shared/constants/logedUser';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  @ViewChild('content') private content: any;

  converId : string
  conversation: any
  converSub : Subscription

  messages: Array<Message>
  messageSub: Subscription
  
  myself = LogedUser.uid;

  photo = Photo

  msgToSend = new FormControl(''/*, Validators.requiredTrue*/)

  constructor(
    public cs : ConversationService,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){

    this.converId = this.activatedRoute.snapshot.paramMap.get('id');

    this.converSub = this.cs.getOneById(this.converId)
      .subscribe( conv => {
        this.conversation = conv;
      });

    this.messageSub = this.cs.getMessages(this.converId, 25)
      .subscribe ( messages => {
        this.messages = messages as Message[];
      });

  }

  ionViewDidEnter(){
  }

  ionViewDidLeave(){
  }

  ngOnDestroy(){
    this.converSub.unsubscribe();
    this.messageSub.unsubscribe();
  }

  onDomChange($event: Event): void {
    this.scrollToBottom();
  }

  sendMessage(){

    if (this.msgToSend.value != ''){

      let message = {
        content: this.msgToSend.value,
        senderId: LogedUser.uid,
        createdAt: serverTimestamp()
      } as Message;

      this.cs.postMessage(this.converId, message);
 
      this.msgToSend.setValue('');

      this.cs.updateConversation(this.converId,{
        updatedAt: serverTimestamp()
      });

    }

  }

  scrollToBottom(){
    setTimeout(() =>{
      this.content.scrollToBottom(300);
    }, 300);
  }


}
