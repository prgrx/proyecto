import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/shared/interfaces/user';
import { AuthService } from 'src/shared/services/auth-service.service';
import { Timestamp, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage implements OnInit {
  @Input() registerForm: FormGroup;
  @Input() userAuth: any;
  remainUser: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    presentation: new FormControl('', Validators.required),
    hobbies: new FormControl('', Validators.required),
    experiences: new FormControl('', Validators.required),
    imageProfile: new FormControl('', Validators.required),
  });
  imageProfile: string;
  registerSubmitted: boolean;
  nameSubmitted: boolean = false;
  birthdaySubmitted: boolean = false;
  presentationSubmitted: boolean = false;
  hobbiesSubmitted: boolean = false;
  experiencesSubmitted: boolean = false;
  imageProfileSubmitted: boolean = false;
  segmentModel: string;
  today: string = new Date().toISOString();
  colorImage: string;
  @ViewChild('slides') slides: IonSlides;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code != 'Tab') return
    event.preventDefault();
  }
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    let prefersDark: boolean = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.colorImage = prefersDark ? 'white' : 'dark';
  }

  ionViewDidEnter(): void {
    this.slides.lockSwipeToNext(true);
  }

  async backToRegister(): Promise<void> {
    (
      await this.authService.loginUser(
        this.registerForm.controls.email.value,
        this.registerForm.controls.password.value
      )
    ).user.delete();
    this.modalController.dismiss();
  }

  nextSlides(formControl: AbstractControl, info?: string): void {
    if (formControl.valid) {
      if (info === 'date') {
        let days: number =
          (new Date().getTime() - new Date(formControl.value).getTime()) /
          (1000 * 60 * 60 * 24);
        days < 5113
          ? this.showToast('Tienes que ser mayor de 14 años', 5)
          : this.nextSlideLogic();
      } else {
        this.nextSlideLogic();
      }
    }
  }

  nextSlideLogic(): void {
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
    this.slides.lockSwipeToNext(true);
  }

  previousSlides(): void {
    this.slides.slidePrev();
  }

  getPhoto(event: any): void {
    let photo: File = event.target.files[0];
    let size: number = +(photo.size / 1024 / 1024).toFixed(2);

    if (size < 1) {
      if (photo != undefined) {
        let reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = () => {
          if (reader.result != null) {
            this.imageProfile = reader.result.toString();
            this.setImgBackground(this.imageProfile);
          }
        };
      }
    } else {
      this.showToast('No se aceptan imagenes de mas de 1MB', 5);
    }
  }

  setImgBackground(img: string): void {
    let circle: HTMLElement = document.querySelector('.circle');
    let circleInside: HTMLElement = document.querySelector('.circle__inside');
    circleInside.style.opacity = '0';
    circle.style.backgroundImage =
      "url('" + img.replace(/(\r\n|\n|\r)/gm, '') + "')";
  }

  registerUser() {
    if (!this.imageProfileSubmitted) return;
    localStorage.setItem('user', JSON.stringify(this.userAuth));
    let user: User = {
      uid: this.userAuth.uid,
      email: this.registerForm.controls.email.value,
      name: this.remainUser.controls.name.value,
      birthday: new Timestamp(
        Math.floor(
          new Date(this.remainUser.controls.birthday.value).getTime() / 1000
        ),
        0
      ),
      presentation: this.remainUser.controls.presentation.value.replaceAll(
        '\n',
        '\\n'
      ),
      hobbies: this.remainUser.controls.hobbies.value.replaceAll('\n', '\\n'),
      experiences: this.remainUser.controls.experiences.value.replaceAll(
        '\n',
        '\\n'
      ),
      photo: this.imageProfile,
      isAdmin: false,
      isOnline: true,
      isBanned: false,
      isVerified: false,
      blocks: [],
      createdAt: serverTimestamp(),
      reports: []
    };
    this.authService.setUserData(user);
    this.router.navigate(['app/profile']);
    this.modalController.dismiss();
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
