import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationService } from 'src/shared/services/conversation.service';
import { UserService } from 'src/shared/services/user.service';
import { Conversation } from 'src/shared/interfaces/conversation';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Photo } from 'src/shared/interfaces/dummyProfilePhoto';

@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  styleUrls: ['messages.page.scss']
})
export class MessagesPage {

  conversations : Array<Conversation> 
  conversSub : Subscription

  user : any

  photo = Photo 

  constructor(
    private conversationService : ConversationService,
    public userService : UserService,
    public af : AngularFirestore,
  ) {}

  ionViewDidEnter(){
    this.conversSub = this.conversationService.getAll()
      .subscribe( (conversations) => {
        this.conversations = conversations as Conversation[]

      });
  }

  ionViewWillLeave(){
    this.conversSub.unsubscribe();
  }

}