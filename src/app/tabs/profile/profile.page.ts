import { Component } from '@angular/core';
import { AuthService } from 'src/shared/services/auth-service.service';
import { CrudDB } from 'src/shared/services/crud-db.service';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/auth';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  userId: any;
  user: User;
  userSub : Subscription

  constructor(
    public authService: AuthService,
    private crudDB : CrudDB, 
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
  }

  ionViewDidEnter(){
    this.userSub = this.crudDB.getOneById('users', this.userId).subscribe( (userData) => {
      this.user = userData as User;
    });
  }

  ionViewDidLeave(){
    this.userSub.unsubscribe();
  }
}
