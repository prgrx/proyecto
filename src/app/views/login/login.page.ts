import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, ModalController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../shared/services/auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRegisterPage } from './modal-register/modal-register.page';
import { FirebaseError } from '@angular/fire/app';
import { User } from 'src/shared/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  segmentModel: string = 'signup';
  emailValid: boolean = true;
  registerSubmitted: boolean = false;
  colorImage: string;
  showPart: string = 'full';
  userAuth: any;
  registerForm = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/),
      ])
    ),
    password: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    checkPrivacy: new FormControl(false, Validators.requiredTrue),
    checkData: new FormControl(false, Validators.requiredTrue),
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngFireAuth: AngularFireAuth,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    let prefersDark: boolean = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.colorImage = prefersDark ? 'white' : 'dark';
  }

  async openModalRegister() {
    const modal = await this.modalController.create({
      component: ModalRegisterPage,
      componentProps: {
        registerForm: this.registerForm,
        userAuth: this.userAuth
      },
    });

    await modal.present();
  }

  loginUser(emailInput: IonInput, passwordInput: IonInput) {
    let email: string = emailInput.value.toString();
    let password: string = passwordInput.value.toString();
    this.authService
      .loginUser(email, password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['app/profile']);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  comprobateEmail(): void {
    this.registerSubmitted = true;
    if (this.registerForm.valid) {
      this.authService
        .registerUser(
          this.registerForm.controls.email.value,
          this.registerForm.controls.password.value
        )
        .then((result) => {
          this.userAuth = result.user;
          this.openModalRegister();
        })
        .catch((error: FirebaseError) => {
          this.emailValid = false;
          if (error.message.includes('formatted')) {
            this.showToast('Tienes que poner un correo correcto', 5);
          } else {
            this.showToast('Ya hay una cuenta creada con ese correo', 5);
          }
        });
    }else {
      if (this.registerForm.controls.checkData.errors || this.registerForm.controls.checkPrivacy.errors) {
        this.showToast('Tienes que aceptar nuestra política de privacidad', 5)
      }
    }
  }

  async showToast(message: string, seconds: number): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    toast.present();
  }
}
