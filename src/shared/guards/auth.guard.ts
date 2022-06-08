import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private firestore: AngularFirestore) {}

  async canActivate() {
    try {
      let user = JSON.parse(localStorage.getItem('user'));
      let id = user.uid;
      let actualUser = (
        await this.firestore
          .doc('/users/' + id)
          .get()
          .toPromise()
      ).data() as User;
      if (actualUser.isBanned) {
        localStorage.removeItem('user');
        this.router.navigate(['banned']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['login']);
      return false;
    }
  }
}
