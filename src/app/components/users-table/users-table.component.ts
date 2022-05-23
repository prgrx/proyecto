import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldValue } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/shared/interfaces/user';
import { NameByIdPipe } from 'src/shared/pipes/name-by-id.pipe';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent implements OnInit {
  @Input() users: User[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private nameByIdPipe: NameByIdPipe
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChange) {
    this.users = changes['users'].currentValue;
  }

  showDate(timestamp: FieldValue): Date {
    return new Date(timestamp['seconds'] * 1000);
  }

  desBanUser(user: User): void {
    this.updateBan(user, false);
    this.showToast('Has desbaneado correctamente a ' + user.name, 5);
  }

  banUser(user: User): void {
    this.updateBan(user, true);
    this.showToast('Has baneado correctamente a ' + user.name, 5);
  }

  updateBan(user: User, isBanned: boolean): void {
    this.firestore.doc('/users/' + user.uid).update({ isBanned: isBanned });
  }

  redirectToUserPage(user: User): void {
    this.router.navigate(['/users/' + user.uid]);
  }

  async showReports(user: User): Promise<void> {
    var options = {
        cssClass: 'alertDelete',
        header: 'Reportes',
        message:
          'Estos son los usuarios que han reportado a ' + user.name + ':',
        buttons: [
          {
            text: 'Cancelar',
          }
        ],
        inputs: []
    };
    options.inputs =  []
    
    for (let report of user.reports) {
      options.inputs.push({ name : 'options', value: await this.nameByIdPipe.transform(report), label: 'Nombres', cssClass: 'name' })
    }
    const alert = await this.alertController.create(options)
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
}
