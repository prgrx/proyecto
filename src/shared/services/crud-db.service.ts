import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class CrudDB {

  constructor( 
    private firebase : AngularFirestore
  ) { }

  getAll(collection: string){
    return this.firebase.collection(collection).get();
  }

  getOneById(collection: string, id: string) {
    return this.firebase.collection(collection).doc(id).valueChanges();
  }

}