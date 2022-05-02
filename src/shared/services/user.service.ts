import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore : AngularFirestore
  ) { }

  getAll(){
    return this.firestore
      .collection('users')
      .snapshotChanges();
  }

  getNameById(id: string) {
    let name = 'Usuario';
      //this.firebase.collection('users');
    return name;
  }

}
