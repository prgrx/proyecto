import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldValue } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Message } from 'src/shared/interfaces/message';
import { User } from 'src/shared/interfaces/user';
import { NameByIdPipe } from 'src/shared/pipes/name-by-id.pipe';
import { ConversationService } from 'src/shared/services/conversation.service';
import { serverTimestamp } from '@firebase/firestore';
import { UserService } from 'src/shared/services/user.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  @Input() users: User[];
  usersSub: Subscription;
  actualFilter: boolean | string = 'everything';
  filterSub: Subscription;
  allUsers: User[];
  actualSearch: string;
  @Input() component: string;
  searchForm: FormGroup = new FormGroup({
    searchValue: new FormControl(''),
    searchFilter: new FormControl(''),
  });

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private nameByIdPipe: NameByIdPipe,
    private conversationService: ConversationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.filterSub =
      this.searchForm.controls.searchFilter.valueChanges.subscribe(
        (searchFilter: string) => {
          searchFilter === 'everything'
            ? (this.actualFilter = 'everything')
            : (this.actualFilter = 'true' === searchFilter);
          this.filterData(this.actualSearch, this.actualFilter);
        }
      );
    this.usersSub = this.searchForm.controls.searchValue.valueChanges.subscribe(
      (searchValue: string) => {
        if (searchValue) {
          this.filterData(searchValue, this.actualFilter);
        } else {
          this.actualSearch = '';
          this.filterData(this.actualSearch, this.actualFilter);
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChange) {
    this.users = changes['users'].currentValue;
    this.allUsers = this.users;
    if (this.actualSearch) {
      this.filterData(this.actualSearch, this.actualFilter);
    }
  }

  ionViewDidLeave(): void {
    this.usersSub.unsubscribe();
    this.filterSub.unsubscribe();
  }

  filterData(searchValue: string, filter: string | boolean) {
    this.actualSearch = searchValue;
    if (filter === 'everything') {
      this.filterEverything(searchValue);
    } else {
      this.filterNotEverything(searchValue, filter);
    }
  }

  filterNotEverything(searchValue: string, filter: string | boolean): void {
    if (searchValue) {
      this.users = this.allUsers.filter((user: User) => {
        return (
          user.isBanned === filter &&
          (user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase()))
        );
      });
    } else {
      this.users = this.allUsers.filter((user: User) => {
        return user.isBanned === filter;
      });
    }
  }

  filterEverything(searchValue: string): void {
    if (searchValue) {
      this.users = this.allUsers.filter((user: User) => {
        return (
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    } else {
      this.users = this.allUsers;
    }
  }

  showDate(timestamp: FieldValue): Date {
    return new Date(timestamp['seconds'] * 1000);
  }

  updateBan(user: User, isBanned: boolean): void {
    this.firestore.doc('/users/' + user.uid).update({ isBanned: isBanned });
  }

  updateVerified(user: User, isVerified: boolean): void {
    this.firestore.doc('/users/' + user.uid).update({ isVerified: isVerified });
  }

  desBanUser(user: User): void {
    this.updateBan(user, false);
    this.showToast('Has desbaneado correctamente a ' + user.name, 5);
  }

  banUser(user: User): void {
    this.updateBan(user, true);
    this.showToast('Has baneado correctamente a ' + user.name, 5);
  }

  unVerifiedUser(user: User): void {
    this.updateVerified(user, false);
    this.showToast('Has desverificado correctamente a ' + user.name, 5);
  }

  verifiedUser(user: User): void {
    this.updateVerified(user, true);
    this.showToast('Has verificado correctamente a ' + user.name, 5);
  }

  redirectToUserPage(user: User): void {
    this.router.navigate(['app/user/' + user.uid]);
  }

  async showReports(user: User): Promise<void> {
    var options = {
      cssClass: 'alertDelete',
      header: 'Reportes',
      message: 'Estos son los usuarios que han reportado a ' + user.name + ':',
      buttons: [
        {
          text: 'Cancelar',
        },
      ],
      inputs: [],
    };
    options.inputs = [];

    for (let report of user.reports) {
      options.inputs.push({
        name: 'options',
        value: await this.nameByIdPipe.transform(report),
        label: 'Nombres',
        cssClass: 'name',
      });
    }
    const alert = await this.alertController.create(options);
    await alert.present();
  }

  async openBanUserAlert(user: User, action: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Banear usuario',
      message:
        '¿Estás seguro de que quieres ' + action + ' a ' + user.name + '?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: action,
          handler: () => {
            action === 'banear' ? this.banUser(user) : this.desBanUser(user);
          },
        },
      ],
    });

    await alert.present();
  }

  async openVerifiedAlert(user: User, action: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Verificar usuario',
      message:
        '¿Estás seguro de que quieres ' + action + ' a ' + user.name + '?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: action,
          handler: () => {
            action === 'verificar' ? this.verifiedUser(user) : this.unVerifiedUser(user);
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, seconds: number): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    await toast.present();
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }

  async notify(id, reports){
    this.contact(
      id,
      `Has sido reportado por ${reports} usuario${(reports == 1) ? '' : 's'}. 
      El equipo Muévete llevará a cabo una investigación 
      para determinar el proceso a seguir. Si piensas que 
      se trata de un error, puedes responder a este mensaje.`
    );
  }


  async contact(id,messageText){
    let conversationId = await this.conversationService.contact(
      this.userService.getMyUserId(),
      id,
      true
    );

    this.conversationService.postMessage(
      conversationId,
      {
        content: messageText,
        senderId: this.userService.getMyUserId(),
        createdAt: serverTimestamp()
      } as Message
    );
  }

  async openChat(id:string){
    let conversationId = await this.conversationService.contact(
      this.userService.getMyUserId(),
      id,
      false
    );

    this.router.navigate(['app/messages/'+ conversationId]);
  }

}
