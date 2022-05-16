import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { LogedUser } from '../constants/logedUser';

@Pipe({
  name: 'excludeMyself'
})

export class ExcludeMyselfPipe implements PipeTransform {

  constructor(
    private af : AngularFirestore,
  ) { }

  async transform(array: Array<string>): Promise<string> {

    return array
      .filter( x => x != JSON.parse(localStorage.getItem('user')).uid )
      //.map( async (x) => (await (await this.af.firestore.doc(`users/${x}`).get())).data()['name'] )
      .join(', ');

  }

}