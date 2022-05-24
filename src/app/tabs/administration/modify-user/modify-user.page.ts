import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.page.html',
  styleUrls: ['./modify-user.page.scss'],
})
export class ModifyUserPage implements OnInit {
  users: User[];
  userSubs: Subscription;
  component: string = 'modify';

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
   this.userSubs = this.firestore
      .collection('/users', (ref) => ref.orderBy('name', 'desc'))
      .valueChanges()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  ionViewDidLeave(): void {
    this.userSubs.unsubscribe();
  }
}
