import { Component, ViewChild } from '@angular/core';
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

  @ViewChild('content') private content: any;

  conversations : Array<Conversation> 
  conversSub : Subscription

  user : any

  photo = Photo 

  constructor(
    private conversationService : ConversationService,
    public userService : UserService,
    public af : AngularFirestore,
  ) {}

  ngOnInit(){
    this.conversSub = this.conversationService.getAll()
    .subscribe( (conversations) => {
      this.conversations = conversations as Conversation[]
    });
    this.display(3000);
  }

  ionViewDidEnter(){
    this.display(500);
  }

  ionViewWillLeave(){
    //this.conversSub.unsubscribe();
  }

  onDomChange($event: Event): void {
    this.display(500);
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

  ngOnDestroy(){
    this.conversSub.unsubscribe();
  }

}