import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogedUser } from 'src/shared/constants/logedUser';
import { User } from 'src/shared/interfaces/auth';
import { Conversation } from 'src/shared/interfaces/conversation';
import { ConversationService } from 'src/shared/services/conversation.service';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  logedUser : User
  allUsers : Array<User>
  allUsersSub : Subscription

  constructor(
    private userService : UserService,
    private convService : ConversationService
  ) {}

  ngOnInit() {
    this.logedUser = LogedUser as User;
  }

  ionViewDidEnter(){
    this.allUsersSub = this.userService.getAll().subscribe(
      allUsers => {
        this.allUsers = allUsers as User[]
      })
  }

  ionViewWillLeave(){
    this.allUsersSub.unsubscribe();
  }

  itsMe(userId){
    return this.logedUser.uid == userId;
  }

  newConversation(){
    this.convService.newConversation({
      members: []
    } as Conversation);
  }

}
