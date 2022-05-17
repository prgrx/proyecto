import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { User } from 'src/shared/interfaces/user';
import { AuthService } from 'src/shared/services/auth-service.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-register',
  templateUrl: './modal-register.page.html',
  styleUrls: ['./modal-register.page.scss'],
})
export class ModalRegisterPage implements OnInit {

  @Input() registerForm: FormGroup;
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
  @ViewChild('slides') slides: IonSlides;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
  ) {}


  ngOnInit() { }
  
  ionViewDidEnter() {
    this.slides.lockSwipeToNext(true);
  }

  async backToRegister(): Promise<void> {
    this.modalController.dismiss();
  }

  nextSlides(formControl: AbstractControl): void {
    if (formControl.valid) {
      this.slides.lockSwipeToNext(false);
      this.slides.slideNext();
      this.slides.lockSwipeToNext(true);
    }
  }

  previousSlides(): void {
    this.slides.slidePrev();
  }

  getPhoto(event: any): void {
    let photo: File = event.target.files[0];
    let size: number = +(event.target.files[0].size / 1024 / 1024).toFixed(2);

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
    if (!this.imageProfileSubmitted) return
    this.authService
      .registerUser(
        this.registerForm.controls.email.value,
        this.registerForm.controls.password.value
      )
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        let user: User = {
          uid: res.user.uid,
          email: this.registerForm.controls.email.value,
          name: this.remainUser.controls.name.value,
          birthday: new Timestamp(Math.floor(new Date(this.remainUser.controls.birthday.value).getTime() / 1000), 0),
          presentation: this.remainUser.controls.presentation.value.replaceAll('\n','\\n'),
          hobbies: this.remainUser.controls.hobbies.value.replaceAll('\n','\\n'),
          experiences: this.remainUser.controls.experiences.value.replaceAll('\n','\\n'),
          photo: this.imageProfile,
          isAdmin: false,
          isOnline: true,
          isBanned: false,
          isVerified: false,
          blocks: [],
        };
        this.authService.setUserData(user);
        this.router.navigate(['app/profile']);
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}