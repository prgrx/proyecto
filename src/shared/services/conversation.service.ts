import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Conversation } from '../interfaces/conversation';
import { Message } from '../interfaces/message';
import { LogedUser } from '../constants/logedUser'


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor( 
    private firestore : AngularFirestore,
  ) { }

  getAll(){
    console.log(LogedUser.uid)
    return this.firestore
      .collection<Conversation>('conversations',
        ref => ref
          .where("members", "array-contains", LogedUser.uid)
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

  newConversation(){

    /** COMPLETAR */

  }

  updateConversation(conversationId: string, data: object){
    this.firestore
      .doc(`conversations/${conversationId}`)
      .update(data)
  }

  getMessages(conversationId: string, limit: number){ 
    return this.firestore
      .collection<Message>(
        `conversations/${conversationId}/messages`,
         ref => ref.orderBy("createdAt").limit(limit)
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

}
