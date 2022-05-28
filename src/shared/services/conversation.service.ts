import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from '../interfaces/conversation';
import { Message } from '../interfaces/message';
import { LogedUser } from '../constants/logedUser'
import { stringify } from 'querystring';
import { serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { error } from 'console';

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

  async newConversation(conversation){

    let conversationId = await this.firestore
      .collection('conversations')
      .add(conversation)
      .then(conv => {
        this.firestore
          .collection(`conversations`)
          .doc(conv.id).update({id: conv.id});
        return conv.id;
      });
    
    console.log(conversationId)
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

  async contact(creatorUid:string, contactUid:string, notify:boolean){

    let conversationId : string;
    let contactUnreads : number;

    let conversationExists = await this.firestore
    .collection<Conversation>('conversations',
      ref => ref
        .where("members", "in", [
          [contactUid, creatorUid],
          [creatorUid, contactUid]
        ])
        .limit(1)
    )
    .get()
    .toPromise()
    .then(x => {
      if(x.size == 1){
        conversationId = x.docs[0].data().id;
        contactUnreads = x.docs[0].data()[contactUid];
      }
      return (x.size == 1 ? true : false)
    });

    if(conversationExists){
      if (notify)
        this.updateConversation(conversationId, {
          [contactUid]: ++contactUnreads,
          updatedAt: serverTimestamp()
        });
    }else{
      conversationId = await this.newConversation({
        members: [creatorUid, contactUid],
        [creatorUid]: 0,
        [contactUid]: 1,
        createdBy: creatorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: "Nueva conversación"
      });
    }

    return conversationId;
  }

}
