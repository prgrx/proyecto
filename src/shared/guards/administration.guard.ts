import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CanActivate, Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdministrationGuard implements CanActivate {
  constructor(private router: Router, private firestore: AngularFirestore){}

  async canActivate() {
      let user = JSON.parse(localStorage.getItem('user'));
      let id = user.uid;
      let actualUser = (await this.firestore.doc('/users/' + id).get().toPromise()).data() as User;
      if (!actualUser.isAdmin) {
        this.router.navigate(['app']);
        return false
      }
      return true
  }
}
