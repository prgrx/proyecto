import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Pipe({
  name: 'nameById'
})

export class NameByIdPipe implements PipeTransform {

  constructor(
    private af : AngularFirestore,
  ) { }

  async transform(id: any): Promise<string> {
    if (id == undefined) return; 
    return (await this.af.firestore.doc(`users/${id}`).get()).data()['name']
  }

}