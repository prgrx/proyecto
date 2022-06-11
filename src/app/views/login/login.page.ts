import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonInput, ModalController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../shared/services/auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRegisterPage } from './modal-register/modal-register.page';
import { FirebaseError } from '@angular/fire/app';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  segmentModel: string = 'login';
  emailValid: boolean = true;
  registerSubmitted: boolean = false;
  loginSubmitted: boolean = false;
  colorImage: string;
  showPart: string = 'full';
  userAuth: any;
  registerForm: FormGroup = new FormGroup({
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
  loginForm: FormGroup = new FormGroup({
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
  });

  constructor(
    public authService: AuthService,
    public userService: UserService,
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
        userAuth: this.userAuth,
      },
      cssClass: 'modalEverything'
    });

    await modal.present();
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      this.authService
        .loginUser(
          this.loginForm.controls.email.value,
          this.loginForm.controls.password.value
        )
        .then((res) => {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userService.update(res.user.uid,{isOnline: true});
          this.router.navigate(['app/profile']);
        })
        .catch((error: FirebaseError) => {
          if (error.message.includes('password')) {
            this.showToast('La contraseña es incorrecta', 5);
          } else if (error.message.includes('no user record')) {
            this.showToast('No hay ningún usuario con esa cuenta de correo', 5);
          }
        });
    }
  }

  keyDown(event: KeyboardEvent, action: string): void {
    if (event.code == 'Enter') {
      action === 'login' ? this.loginUser() : this.comprobateEmail();
    }
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
    } else {
      if (
        this.registerForm.controls.checkData.errors ||
        this.registerForm.controls.checkPrivacy.errors
      ) {
        this.showToast('Tienes que aceptar nuestra política de privacidad', 5);
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
