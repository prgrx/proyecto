import { Component } from '@angular/core';
import { AuthService } from 'src/shared/services/auth-service.service';
import { Subscription } from 'rxjs';
import { User } from '@firebase/auth';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  userId: any
  user: User
  userSub : Subscription

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
  }

  ionViewDidEnter(){
    this.userSub = this.userService.get(this.userId).subscribe( (user) => {
      this.user = user as User;
    });
  }

  ionViewDidLeave(){
    this.userSub.unsubscribe();
  }
}
