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

  getAll(){
    return this.firestore
      .collection('users',
      ref => ref
        .where("uid", "!=", LogedUser.uid)
      )
      .valueChanges();
  }

  get(id){
    return this.firestore
      .collection('users')
      .doc(id)
      .valueChanges();
  }

}
