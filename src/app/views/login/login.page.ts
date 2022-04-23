import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { IonInput } from '@ionic/angular';
import { User } from 'src/shared/interfaces/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "../../../shared/services/auth-service.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segmentModel = 'login';
  
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngFireAuth: AngularFireAuth,
    private ngZone : NgZone,
  ) { }

  ngOnInit() {
  }

  signUp(emailInput: IonInput, passwordInput: IonInput, nameInput: IonInput){
    let email: string = emailInput.value.toString();
    let password: string = passwordInput.value.toString();
    let name: string = nameInput.value.toString();

    this.authService.registerUser(email, password).then((res) => {
      localStorage.setItem('user', JSON.stringify(res.user));
      let user : User = {
        uid: res.user.uid,
        email: email,
        password: password,
        name: name
      };
      this.authService.setUserData(user);
    }).catch((error) => {
      console.log(error);
    });
    this.router.navigate(['app/profile']);
  }

  loginUser(emailInput: IonInput, passwordInput: IonInput){
    let email: string = emailInput.value.toString();
    let password: string = passwordInput.value.toString();
    this.authService.loginUser(email, password)
    .then((res) => {
      localStorage.setItem('user', JSON.stringify(res.user));
      this.router.navigate(['app/profile']);
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

}
