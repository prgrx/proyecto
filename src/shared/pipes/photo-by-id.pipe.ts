import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Photo } from '../interfaces/dummyProfilePhoto';

@Pipe({
  name: 'photoById'
})

export class PhotoByIdPipe implements PipeTransform {

  constructor(
    private af : AngularFirestore,
  ) { }

  async transform(id: any): Promise<string> {
    if (id == undefined) return Photo; 
    return (await this.af.firestore.doc(`users/${id}`).get()).data()['photo']
  }

}