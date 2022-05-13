import { Component, Input, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/shared/interfaces/product';
import { serverTimestamp } from '@angular/fire/firestore';
import { Comment } from 'src/shared/interfaces/comment';
import { User } from 'src/shared/interfaces/user';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  @Input() product: Product;
  comments: Comment[] = [];
  commentGroup: FormGroup = new FormGroup({
    comment: new FormControl('', Validators.required),
  });
  user_id: string = JSON.parse(localStorage.getItem('user')).uid;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getAllComments();
  }

  addComment(): void {
    if (this.commentGroup.valid) {
      let comment: Comment = {
        id: this.firestore.createId(),
        user_id: JSON.parse(localStorage.getItem('user')).uid,
        content: this.commentGroup.controls.comment.value,
        date: serverTimestamp(),
        likes: [],
      };

      this.firestore
        .doc('/products/' + this.product.id + '/comments/' + comment.id)
        .set(comment, {
          merge: true,
        });
      this.commentGroup.reset();
    }
  }

  getAllComments(): void {
    this.firestore
      .collection('/products/' + this.product.id + '/comments', (ref) =>
        ref.orderBy('date', 'desc')
      )
      .valueChanges()
      .subscribe((comments: Comment[]) => {
        if (comments.length === 0) return;
        if (comments[0].date === null) return;
        this.comments = comments;
      });
  }

  getUserComment(id: string): User {
    let user: User;
    this.firestore
      .collection('/users')
      .doc(id)
      .valueChanges()
      .subscribe((userBD) => {
        user = userBD as User;
      });
    return user;
  }

  likeComment(comment: Comment): void {
    if (comment.likes.includes(this.user_id)) {
      comment.likes.splice(comment.likes.indexOf(this.user_id), 1);
    } else {
      comment.likes.push(this.user_id);
    }
    this.firestore
      .doc('/products/' + this.product.id + '/comments/' + comment.id)
      .update({ likes: comment.likes });
  }

  async openAlertDelete(comment: Comment) {
    const alert = await this.alertController.create({
      cssClass: 'alertDelete',
      header: 'Eliminar Comentario',
      message:
        '¿Estás seguro de que quieres eliminar el comentario?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.firestore
            .doc('/products/' + this.product.id + '/comments/' + comment.id)
            .delete();
            this.showToast('¡Se ha eliminado el comentario correctamente!', 5);
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, seconds: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: seconds * 1000,
      color: 'light',
    });
    toast.present();
  }

  trackByFn(item: any): number {
    return item.serialNumber;
  }
}
