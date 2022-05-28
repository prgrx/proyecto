import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LogedUser } from '../constants/logedUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore : AngularFirestore
  ) { }

  getMyUserId(){
    return JSON.parse(localStorage.getItem('user')).uid;
  }

  getAll(){
    return this.firestore
      .collection('users',
      ref => ref
        .where("uid", "!=", JSON.parse(localStorage.getItem('user')).uid)
      )
      .valueChanges();
  }

  get(id){
    return this.firestore
      .collection('users')
      .doc(id)
      .valueChanges();
  }

  getData(id){
    return this.firestore
      .collection('users')
      .doc(id)
      .get();
  }

  update(id,data){
    this.firestore
      .doc(`users/${id}`)
      .update(data);
  }

}
