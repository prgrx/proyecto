import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/shared/services/auth-service.service';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';
import { UserService } from 'src/shared/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {

  userId: string
  user: User
  userSub : Subscription
  userVerified : boolean = false
  photoEventSet : boolean = false

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private _elementRef: ElementRef, 
    public alertCtrl : AlertController
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
    this.userSub = this.userService.get(this.userId).subscribe( (user) => {
      this.user = user as User;
    });

    let sections = [
      'presentation',
      'hobbies',
      'experiences'
    ];

    sections.forEach( section => {
      let el = this.element('#'+section);
      let editBtn = this.element('#edit-'+section);
  
      el.addEventListener('keydown', (evt) => {
        if (evt.keyCode === 13) {
            evt.preventDefault();
        }
      });

      el.addEventListener('keyup', ()=> {
        if (el.innerText != this.user[section]) {
          editBtn.classList.add('highlight');
        }else{
          editBtn.classList.remove('highlight');
        }
      });
    });

  }

  ionViewWillEnter(){
  }

  ionViewDidEnter(){
  }

  ionViewWillLeave(){
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  logOut(){
    this.authService.signOut(this.userId);
  }

  edit(section){
    let el = this.element('#'+section);
    let editBtn = this.element('#edit-'+section);
    let cancelBtn = this.element('#cancel-'+section);
    cancelBtn.classList.remove('hidden');
    cancelBtn.style.display = '';

    el.spellcheck = false;

    if(el.contentEditable == 'true'){
      editBtn.innerText = 'Editar';
      this.userService.update(
        this.user.uid, 
        {[section]: el.innerText}
      );
      editBtn.classList.remove('highlight');
      cancelBtn.classList.add('hidden');
      el.contentEditable = 'false';
    }else{
      editBtn.innerText = 'Guardar';
      el.contentEditable = 'true';
      el.focus();
    }
  }

  cancel(section){
    let el = this.element('#'+section);
    let editBtn = this.element('#edit-'+section);
    let cancelBtn = this.element('#cancel-'+section);
    editBtn.innerText = 'Editar';
    editBtn.classList.remove('highlight');
    el.innerText = this.user[section];
    el.contentEditable = 'false';
    cancelBtn.style.display = 'none';
  }

  changePhoto(input){
    let fileInput = this.element(input);

    fileInput.click();

    if(!this.photoEventSet){
      this.photoEventSet = true;

      fileInput.addEventListener("change", () =>{

        let photo = fileInput.files[0];

        let fr = new FileReader();
        fr.readAsDataURL(photo);
        fr.onload = () => {

          if (fr.result != null) {
            let base64 = fr.result.toString();

            this.presentConfirm(
              '¿Cambiar foto de perfil?',
              `
              <div class="ion-text-center">
                  <img 
                    src="${base64}"
                    style="
                      height: 50px !important; 
                      width: 50px !important; 
                      border-radius: 50%; 
                      margin:0 auto;
                    "
                  >
              </div>
              `
              ,
              'Cambiar',
              async () => {
                this.uploadPhoto(base64);
              }
            );

          }

        };
        
      });

    }
  }

  uploadPhoto(photo:string){
    this.userService.update(this.userId,{
      photo: photo
    });
  }

  element(query:string){
    return this
      ._elementRef
      .nativeElement
      .querySelector(query);
  }

  async presentConfirm(
    title:string, 
    text:string, 
    button:string, 
    action:any
  ) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: button,
          handler: action
        }
      ]
    });
    await alert.present();
  }

}
