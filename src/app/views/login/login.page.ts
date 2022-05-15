import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { IonInput, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from "../../../shared/services/auth-service.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRegisterPage } from './modal-register/modal-register.page';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segmentModel: string = 'login';
  registerSubmitted: boolean = false;
  registerForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngFireAuth: AngularFireAuth,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  async openModalRegister(){
    this.registerSubmitted = true;
    if (this.registerForm.valid) {
      const modal = await this.modalController.create({
        component: ModalRegisterPage,
        componentProps: {
          registerForm: this.registerForm,
        }
      });
  
      await modal.present();
    }
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
