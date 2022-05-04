import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

  messages: Array<any>
  messageSub: Subscription

  //DummyPhoto [BORRAR CUANDO FUNCIONE]
  photo = Photo

  msgToSend = new FormControl(''/*, Validators.requiredTrue*/)

  constructor(
    public cs : ConversationService,
    private activatedRoute : ActivatedRoute
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
        this.messages = messages as Message[]
      });

    this.scrollToBottom();

  }

  ionViewDidLeave(){

  }

  sendMessage(){
    if (this.msgToSend.value != ''){

      this.cs.postMessage(this.converId, {
        content: this.msgToSend.value,
        senderId: LogedUser.uid,
        createdAt: serverTimestamp()
      } as Message)

      this.cs.updateConversation(this.converId,{
        updatedAt: serverTimestamp()
      });

      this.msgToSend.setValue('');
      this.scrollToBottom();

    }

  }


  scrollToBottom(){
    setTimeout( () => {
      this.content.scrollToBottom(300);
    }, 2000)
  }


}
