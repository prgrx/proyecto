import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';

import { User } from 'src/shared/interfaces/user'
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public userService: UserService,
    public router: Router
  ) { }

  loginUser(email: string, password: string) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      name : user.name
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  async signOut(id) {
    return this.ngFireAuth.signOut().then(() => {
      this.userService.update(id,{isOnline: false});
      localStorage.removeItem('user');
      this.router.navigate(['login'], { replaceUrl: true });
    });
  }
}
