import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from '../interfaces/conversation';
import { Message } from '../interfaces/message';
import { LogedUser } from '../constants/logedUser'
import { stringify } from 'querystring';
import { serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor( 
    private firestore : AngularFirestore,
    private userService : UserService,
    public router : Router
  ) { }

  getAll(){
    return this.firestore
      .collection<Conversation>('conversations',
        ref => ref
          .where("members", "array-contains", JSON.parse(localStorage.getItem('user')).uid)
          .orderBy("updatedAt", "desc")
      )
      .valueChanges();
  }

  getOneById(id: string){
    return this.firestore
      .collection('conversations')
      .doc(id)
      .valueChanges();
  }

  getOneByIdData(id: string){
    return this.firestore
      .collection('conversations')
      .doc(id)
      .get().toPromise()
  }

  getNotifications(){
    return this.firestore
    .collection<Conversation>('conversations',
      ref => ref
        .where(this.userService.getMyUserId(), ">", 0)
        .orderBy(this.userService.getMyUserId())
        .limit(1)
    )
    .valueChanges();
  }

  newConversation(conversation: Conversation){

    let conversationId:string;

    this.firestore
      .collection('conversations')
      .add(conversation)
      .then(conv => {
        this.firestore
          .collection(`conversations`)
          .doc(conv.id).update({id: conv.id});
        conversationId = conv.id;
      });
    
    return conversationId;
  }

  updateConversation(conversationId: string, data: object){
    this.firestore
      .doc(`conversations/${conversationId}`)
      .update(data)
  }

  deleteConversation(conversationId: string){
    this.firestore
      .doc(`conversations/${conversationId}`)
      .delete();
  }

  deleteMessage(conversationId: string, messageId: string){
    this.firestore
      .doc(`conversations/${conversationId}/messages/${messageId}`)
      .update({deleted: true});
  }

  getMessages(conversationId: string, limit: number){ 
    return this.firestore
      .collection<Message>(
        `conversations/${conversationId}/messages`,
         ref => ref.orderBy("createdAt").limitToLast(limit)
      )
      .valueChanges();
  }

  postMessage(conversationId: string, message: Message){
    this.firestore
      .collection(`conversations/${conversationId}/messages`)
      .add(message)
      .then(msg => {
        this.firestore
          .collection(`conversations/${conversationId}/messages`)
          .doc(msg.id)
          .update({messageId: msg.id});
      });
  }

  contact(creatorUid, contactUid){
    let conversationId:string;

    if(true/** existe conver con uid1 y uid2 */){
      conversationId = ''//getConversationIdWithUsers(creatorUid, contactUid);
    }else{
      conversationId = this.newConversation({
        members: [creatorUid, contactUid],
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: creatorUid,
      } as Conversation);
    }

    this.router.navigate(['app/messages/'+conversationId]);
  }

}
