import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/shared/services/auth-service.service';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';
import { UserService } from 'src/shared/services/user.service';

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

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private _elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user')).uid;
    this.userSub = this.userService.get(this.userId).subscribe( (user) => {
      this.user = user as User;
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

    el.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 13) {
          evt.preventDefault();
      }
    });

    if(el.contentEditable == 'true'){
      editBtn.innerText = 'Editar';
      this.userService.update(
        this.user.uid, 
        {[section]: el.innerText}
      );
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
    el.innerText = this.user[section];
    el.contentEditable = 'false';
    cancelBtn.style.display = 'none';
  }

  element(query:string){
    return this
      ._elementRef
      .nativeElement
      .querySelector(query);
  }


}
