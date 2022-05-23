import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  users: User[];
  usersSub: Subscription;
  component: string = 'principal';
  
  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.usersSub = this.firestore
      .collection('/users/', (ref) => ref.orderBy('createdAt', 'desc'))
      .valueChanges()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }


  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }
}
