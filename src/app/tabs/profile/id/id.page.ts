import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/shared/interfaces/user';
import { ConversationService } from 'src/shared/services/conversation.service';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-id',
  templateUrl: './id.page.html',
  styleUrls: ['./id.page.scss'],
})
export class IdPage implements OnInit {

  userId: string

  user: User
  userSub: Subscription

  myself: User
  myselfSub: Subscription

  constructor(
    //private _elementRef: ElementRef
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    public router: Router,
    public alertCtrl: AlertController,
    private _location: Location
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    this.userSub = this.userService.get(this.userId).subscribe( (user) => {
      this.user = user as User;
    });

    this.myselfSub = this.userService.get(this.userService.getMyUserId()).subscribe( (user) => {
      this.myself = user as User;
    });

  }

  ionViewWillEnter(){

  }

  async ionViewDidEnter(){
    /*let tab = await this._elementRef
      .nativeElement
      .querySelector('[tab="profile"]');

    tab.classList.remove('tab-selected');*/
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
    this.myselfSub.unsubscribe();
  }

  async contact(contactId){
    let conversationId = await this.conversationService.contact(
      this.userService.getMyUserId(),
      contactId,
      false
    );

    this.router.navigate(['app/messages/'+conversationId]);
  }

  async block(id:string){

    let blocks = this.myself.blocks;

    this.presentConfirm(
      `${blocks.includes(id) ? 'Desbloquear' : 'Bloquear'} usuario`,
      `¿Seguro que quieres ${(blocks.includes(id)) ? 'des' : ''}bloquear a
       ${this.user.name}? Si lo haces ${blocks.includes(id) ? '' : 'no'} 
       podréis ${blocks.includes(id) ? 'volver a' : ''} contactar por chat 
       ${blocks.includes(id) ? 'y' : 'ni'} comentar vuestros productos.`,
       blocks.includes(id) ? 'Desbloquear' : 'Bloquear',
      async () => {
        if (blocks.includes(id)){
          blocks = blocks.filter(x => x != id);
        }else{
          blocks.push(id)
        }
        this.userService.update(
          this.userService.getMyUserId(),
          {blocks: blocks}
        )
      }
    );
  }

  async report(id:string){
    let reports =  this.user.reports;

    this.presentConfirm(
      !reports.includes(id) ? `Reportar usuario` : `Usuario reportado`,
      !reports.includes(id) 
        ? `¿Seguro que quieres reportar a ${this.user?.name}? 
          Si lo haces, puede que contactemos contigo para preguntar 
          e investigar el motivo.` 
        : `Ya has reportado a ${this.user?.name}.`,
      !reports.includes(id) ? 'Reportar' : 'Ok',
      async () => {
        if (!reports.includes(id)){
          reports.push(this.userService.getMyUserId());

          this.userService.update(
            id,
            {reports: reports}
          )
        }
      }
    );
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


  goBack(){
    setTimeout(() => {
      this._location.back();
    }, 300)
  }

}
